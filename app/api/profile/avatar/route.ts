import sharp, { OutputInfo } from "sharp";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { auth } from "@/utils/auth";
import { files, avatarPublicBaseUrl } from "@/lib/neon-files";

// Sharp requires the Node.js runtime.
export const runtime = "nodejs";

// Upload restrictions.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const MAX_IMAGE_DIMENSION = 12_000;

// Output configuration.
const AVATAR_SIZE = 512;
const WEBP_QUALITY = 82;

// Accepted MIME types and their actual Sharp formats.
const ALLOWED_TYPES = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export async function POST(request: Request) {
  // 1. Authenticate user.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 2. Reject obviously oversized requests early.
  const contentLength = Number(request.headers.get("content-length"));

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_FILE_SIZE + 128 * 1024
  ) {
    return NextResponse.json(
      { error: "Image must be smaller than 4 MB." },
      { status: 413 },
    );
  }

  // 3. Extract uploaded file.
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image was provided." },
      { status: 400 },
    );
  }

  // 4. Validate MIME type.
  const expectedFormat = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES];

  if (!expectedFormat) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP are supported." },
      { status: 415 },
    );
  }

  // 5. Validate original file size.
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 4 MB." },
      { status: 413 },
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let optimizedImage: Buffer;
  let imageInfo: OutputInfo;

  // 6. Process and optimize the image.
  try {
    const imageOptions = {
      failOn: "error" as const,
      limitInputPixels: MAX_INPUT_PIXELS,
      sequentialRead: true,
    };

    // Read actual image metadata rather than trusting
    // the MIME type supplied by the browser.
    const metadata = await sharp(inputBuffer, imageOptions).metadata();

    if (!metadata.width || !metadata.height || !metadata.format) {
      throw new Error("Invalid image dimensions.");
    }

    // Ensure the actual image format matches the
    // declared file type.
    if (metadata.format !== expectedFormat) {
      return NextResponse.json(
        { error: "The image format does not match the file type." },
        { status: 415 },
      );
    }

    // Prevent excessively large image dimensions.
    if (
      metadata.width > MAX_IMAGE_DIMENSION ||
      metadata.height > MAX_IMAGE_DIMENSION ||
      metadata.width * metadata.height > MAX_INPUT_PIXELS
    ) {
      return NextResponse.json(
        { error: "Image dimensions are too large." },
        { status: 413 },
      );
    }

    // Resize, crop, rotate, and compress.
    const result = await sharp(inputBuffer, imageOptions)
      // Automatically correct EXIF orientation.
      .rotate()

      // Crop into a square avatar.
      .resize({
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        fit: "cover",
        position: "centre",
      })

      // Convert into optimized WebP.
      .webp({
        quality: WEBP_QUALITY,
        effort: 5,
        smartSubsample: true,
      })

      .toBuffer({
        resolveWithObject: true,
      });

    optimizedImage = result.data;
    imageInfo = result.info;
  } catch (error) {
    console.error("Image processing failed:", error);

    return NextResponse.json(
      {
        error: "Invalid or unsupported image. Please choose another picture.",
      },
      { status: 400 },
    );
  }

  // 7. Generate a unique WebP filename.
  const key = `users/${session.user.id}/avatars/${randomUUID()}.webp`;

  try {
    // Convert optimized buffer into a File.
    const processedFile = new File(
      [optimizedImage as BlobPart],
      "avatar.webp",
      {
        type: "image/webp",
      },
    );

    // 8. Upload optimized image to Neon.
    await files.upload(key, processedFile, {
      contentType: "image/webp",
    });

    const url = await files.url(key);

    // 9. Return image URL and optimization details.
    return NextResponse.json({
      url,
      key,

      optimization: {
        originalBytes: file.size,
        optimizedBytes: optimizedImage.byteLength,
        width: imageInfo.width,
        height: imageInfo.height,
        format: "webp",
      },
    });
  } catch (error) {
    // Remove uploaded file if subsequent operations fail.
    await files.delete(key).catch(() => undefined);

    console.error("Avatar upload failed:", error);

    return NextResponse.json(
      { error: "Failed to upload profile picture." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const imageUrl = body?.url;

    if (typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid image URL." },
        { status: 400 },
      );
    }

    let key: string | null = null;

    try {
      const baseUrl = new URL(`${avatarPublicBaseUrl}/`);
      const parsedUrl = new URL(imageUrl);

      if (
        parsedUrl.origin === baseUrl.origin &&
        !parsedUrl.search &&
        !parsedUrl.hash &&
        parsedUrl.pathname.startsWith(baseUrl.pathname)
      ) {
        const decodedKey = decodeURIComponent(
          parsedUrl.pathname.slice(baseUrl.pathname.length),
        );

        const ownedPrefix = `users/${session.user.id}/avatars/`;
        const filename = decodedKey.slice(ownedPrefix.length);

        // Only allow the generated avatar filename format.
        if (
          decodedKey.startsWith(ownedPrefix) &&
          /^[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(filename)
        ) {
          key = decodedKey;
        }
      }
    } catch {
      // Invalid or external URLs are not storage objects we manage.
    }

    // External profile pictures are not deleted from Neon.
    if (!key) {
      return NextResponse.json({ success: true });
    }

    await files.delete(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar deletion failed:", error);

    return NextResponse.json(
      { error: "Failed to delete profile picture." },
      { status: 500 },
    );
  }
}

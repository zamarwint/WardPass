import { processAvatar } from "@/lib/image-processor";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { auth } from "@/utils/auth";
import { files, avatarPublicBaseUrl } from "@/lib/neon-files";

// Jimp requires the Node.js runtime.
export const runtime = "nodejs";

// Upload restrictions.
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  // 1. Authenticate the user.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 2. Check request size.
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
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image was provided." },
      { status: 400 },
    );
  }

  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 4 MB." },
      { status: 413 },
    );
  }

  // 4. Convert the uploaded file into a buffer.
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // 5. Process and optimize.
  const optimizedImage = await processAvatar(inputBuffer, file.type);

  const key = `users/${session.user.id}/avatars/${randomUUID()}.${optimizedImage.extension}`;

  try {
    const processedFile = new File(
      [new Uint8Array(optimizedImage.buffer)],
      `avatar.${optimizedImage.extension}`,
      {
        type: optimizedImage.mime,
      },
    );

    await files.upload(key, processedFile, {
      contentType: optimizedImage.mime,
    });

    const url = await files.url(key);

    return NextResponse.json({
      url,
      key,
      optimization: {
        originalBytes: file.size,
        optimizedBytes: optimizedImage.buffer.length,
        width: optimizedImage.width,
        height: optimizedImage.height,
        format: optimizedImage.mime,
      },
    });
  } catch (error) {
    console.error("Neon storage upload failed:", error);

    await files.delete(key).catch(() => undefined);

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

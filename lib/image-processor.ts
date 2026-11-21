import "server-only";

import { Jimp } from "jimp";
import { rotation } from "exifr";
import { imageSize } from "image-size";

const AVATAR_SIZE = 512;
const JPEG_QUALITY = 82;

const MAX_INPUT_PIXELS = 40_000_000;
const MAX_DIMENSION = 12_000;

const SUPPORTED_FORMATS = {
  "image/jpeg": "jpg",
  "image/png": "png",
} as const;

interface ProcessedAvatar {
  buffer: Buffer;
  width: number;
  height: number;
  mime: "image/jpeg" | "image/png";
  extension: "jpg" | "png";
}

export async function processAvatar(
  input: Buffer,
  declaredMimeType: string,
): Promise<ProcessedAvatar> {
  const expectedFormat =
    SUPPORTED_FORMATS[declaredMimeType as keyof typeof SUPPORTED_FORMATS];

  if (!expectedFormat) {
    throw new Error("Only JPEG and PNG images are supported.");
  }

  // 1. Validate image dimensions before decoding.
  const dimensions = imageSize(input);

  if (dimensions.type !== expectedFormat) {
    throw new Error("Image format does not match its file type.");
  }

  const { width, height } = dimensions;

  if (!width || !height) {
    throw new Error("Invalid image dimensions.");
  }

  if (
    width > MAX_DIMENSION ||
    height > MAX_DIMENSION ||
    width * height > MAX_INPUT_PIXELS
  ) {
    throw new Error("Image dimensions are too large.");
  }

  // 2. Decode the image using Jimp.
  const image = await Jimp.read(input);

  if (image.mime !== declaredMimeType) {
    throw new Error("Invalid image content.");
  }

  // 3. Correct EXIF orientation.
  const orientation = await rotation(input);

  if (orientation) {
    if (orientation.deg) {
      image.rotate(-orientation.deg);
    }

    if (orientation.scaleX === -1 || orientation.scaleY === -1) {
      image.flip({
        horizontal: orientation.scaleX === -1,
        vertical: orientation.scaleY === -1,
      });
    }
  }

  // 4. Resize and crop to 512 × 512.
  image.cover({
    w: AVATAR_SIZE,
    h: AVATAR_SIZE,
  });

  // 5. Preserve transparency in PNG images.
  // JPEG images are compressed at quality 82.
  const outputMime =
    declaredMimeType === "image/png" ? "image/png" : "image/jpeg";

  const buffer =
    outputMime === "image/jpeg"
      ? await image.getBuffer("image/jpeg", {
          quality: JPEG_QUALITY,
        })
      : await image.getBuffer("image/png");

  return {
    buffer,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    mime: outputMime,
    extension: outputMime === "image/png" ? "png" : "jpg",
  };
}

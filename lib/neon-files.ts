import "server-only";

import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const bucket = process.env.NEON_STORAGE_BUCKET;
const endpoint = process.env.AWS_ENDPOINT_URL_S3;

if (!bucket || !endpoint) {
  throw new Error("Missing Neon storage configuration.");
}

// Neon public-read URL format:
// {endpoint}/{bucket}/{key}
export const avatarPublicBaseUrl = `${endpoint.replace(/\/+$/, "")}/${bucket}`;

export const files = new Files({
  adapter: neon({
    bucket,
    publicBaseUrl: avatarPublicBaseUrl,
  }),
});

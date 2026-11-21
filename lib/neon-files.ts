import "server-only";

import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const {
  AWS_ENDPOINT_URL_S3,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  NEON_STORAGE_BUCKET,
} = process.env;

const missing = [
  ["AWS_ENDPOINT_URL_S3", AWS_ENDPOINT_URL_S3],
  ["AWS_ACCESS_KEY_ID", AWS_ACCESS_KEY_ID],
  ["AWS_SECRET_ACCESS_KEY", AWS_SECRET_ACCESS_KEY],
  ["NEON_STORAGE_BUCKET", NEON_STORAGE_BUCKET],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(
    `Missing Neon storage environment variables: ${missing.join(", ")}`,
  );
}

const endpoint = AWS_ENDPOINT_URL_S3!.replace(/\/+$/, "");
const bucket = NEON_STORAGE_BUCKET!;

export const avatarPublicBaseUrl = `${endpoint}/${bucket}`;

export const files = new Files({
  adapter: neon({
    bucket,
    endpoint,
    region: AWS_REGION || "us-east-1",
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,

    // Use this only with a public_read bucket.
    publicBaseUrl: avatarPublicBaseUrl,
  }),
});

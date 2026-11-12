import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  buckets: {
    "wp-avatars-store": {
      access: "public_read",
    },
  },
});

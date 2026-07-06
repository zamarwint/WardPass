import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        RESEND_API_KEY: z.string().min(1),
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    experimental__runtimeEnv: {}
});
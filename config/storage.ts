import { S3Client } from "@aws-sdk/client-s3";
import env from "@/lib/env";

export const R2 = new S3Client({
  region: env.CLOUDFLARE_REGION,
  endpoint: env.CLOUDFLARE_URL,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: env.CLOUDFLARE_SECRET_KEY,
  },
});

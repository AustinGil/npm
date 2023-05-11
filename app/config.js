import { z } from 'zod'

export const s3Config = z.object({
  url: z.string().min(1),
  region: z.string().min(1),
  accessKey: z.string().min(1),
  secretKey: z.string().min(1)
}).parse({
  url: process.env.S3_URL,
  region: process.env.S3_REGION,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY
})


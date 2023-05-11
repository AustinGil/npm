export { default as stream } from "stream";
import { S3Client } from '@aws-sdk/client-s3'

const S3_URL = process.env.S3_URL;

export const s3Client = new S3Client({
  endpoint: `https://${S3_URL}`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: process.env.S3_REGION,
});

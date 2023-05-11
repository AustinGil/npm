import { S3Client, CreateMultipartUploadCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Config } from '../config.js'
// @ts-check
/**
 * @typedef {import('@aws-sdk/client-s3').PutObjectCommandInput} PutObjectCommandInput
 */

const s3Client = new S3Client({
  endpoint: s3Config.url,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  },
  region: s3Config.region,
});

/**
 * @param {PutObjectCommandInput['Body']} item
 * @param {string} path
 */
export default function uploadToS3(item, path) {
  /** @type {PutObjectCommandInput} */
  const params = {
    Bucket: 'npm',
    Key: path,
    Body: item
  };
  const command = new PutObjectCommand(params)
  return s3Client.send(command)
}

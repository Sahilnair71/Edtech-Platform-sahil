// server.js (or a separate AWS configuration file)
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
    // Alternatively, for production on AWS, you might omit credentials
    // and rely on an IAM role/profile.
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
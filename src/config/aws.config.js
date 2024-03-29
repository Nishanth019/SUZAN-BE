const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Create an instance of the S3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_BUCKET_REGION,
});

// Function to get a signed URL with appropriate headers
async function getSignedUrlWithHeaders(bucketName, objectKey) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  // Get a signed URL with additional response headers
  const signedUrl = await getSignedUrl(s3Client, command, {
    responseHeaders: {
      "Content-Disposition": "inline",
    },
  });

  return signedUrl;
}

module.exports = { s3Client, getSignedUrlWithHeaders };

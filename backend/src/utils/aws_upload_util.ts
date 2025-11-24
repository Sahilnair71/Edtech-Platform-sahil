import {s3Client} from "../config/aws_s3_config"
import {DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3"
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

export const uploadFileToAws = async (fileName, filePath) => {
    try {
      // Configure the parameters for the S3 upload
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fs.createReadStream(filePath), 
      };
  
      // Upload the file to S3
        await s3Client.send(new PutObjectCommand(uploadParams)).then((data)=>{
        // Delete the file from the local filesystem after successful upload
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully.');
            }
            });
        }
      });
  
    } catch (err) {
      console.error('Error ', err);
      return 'error';
    }
};

export const getFileUrlFromAws = async (fileName, expireTime = null) => {
    try {
        // Check if the file is available in the AWS S3 bucket
        const check = await isFileAvailableInAwsBucket(fileName); 

        if (check) {
            // Create a GetObjectCommand to retrieve the file from S3
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME, // Specify the AWS S3 bucket name
                Key: fileName, // Specify the file name
            });

            // Generate a signed URL with expiration time if provided
            if (expireTime != null) {
                const url = await getSignedUrl(s3Client, command, { expiresIn: expireTime });
                return url;
            } else {
                // Generate a signed URL without expiration time
                const url = await getSignedUrl(s3Client, command);
                return url;
            }
        } else {
            // Return an error message if the file is not available in the bucket
            return "error";
        }
    } catch (err) {
        // Handle any errors that occur during the process
        console.log("error ::", err);
        return "error";
    }
};

export const isFileAvailableInAwsBucket = async (fileName) => {
    try {
        // Check if the object exists
        await s3Client.send(new HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        }));
  
        // If the object exists, return true
        return true;
    } catch (err) {
        if (err.name === 'NotFound') {
            // File not found in AWS bucket, return false
            return false;
        } else {
            // Handle other errors
            return false;
        }
    }
  };


  export const deleteFileFromAws = async (fileName) => {
    try {
      // Configure the parameters for the S3 upload
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
      };
      // Upload the file to S3
        await s3Client.send(new DeleteObjectCommand(uploadParams)).then((data)=>{
      });
  
    } catch (err) {
      console.error('Error ', err);
      return  'error';
    }
};



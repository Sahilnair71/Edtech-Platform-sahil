import { Request, Response } from "express";
import prisma from "../config/prisma.config";
import {s3Client} from "../config/aws_s3_config"
import {uploadFileToAws} from "../utils/aws_upload_util"

export const uploadFileToAwsS3 = async function(dataObject) {
    try {
        // Define the path where the file will be saved locally
        const savePath = `../uploads/abcd.txt`;
        
        // Upload the file to AWS S3 bucket in the specified subfolder
        await uploadFileToAws(`${process.env.AWS_FOLDER_THUMBNAIL}/${dataObject.fileName}`, `${savePath}`);
    } catch (error) {
        console.error("Error uploading file to AWS S3:", error);
        throw error;
    }
}
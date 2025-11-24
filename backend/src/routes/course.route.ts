import { Router } from "express";
import {uploadFileToAwsS3} from "../controllers/course.controller"


const router = Router();
router.post("/files/", uploadFileToAwsS3)
export default router
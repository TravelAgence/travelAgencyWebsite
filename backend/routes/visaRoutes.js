import express from "express";
import { submitVisaRequest } from "../controllers/visaController.js";
import upload from "../config/multerConfig.js"; // Import multer configuration

const router = express.Router();

router.post("/submit", upload.single('passportImage'), submitVisaRequest);

export default router;
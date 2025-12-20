import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';

const uploadRouter = Router();

// Use memory storage to process file buffer with sharp before uploading
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Single image upload route
uploadRouter.post('/', upload.single('image'), uploadImage);

export { uploadRouter };

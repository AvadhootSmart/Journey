import { Request, Response } from 'express';
import { cloudinary } from '../lib/cloudinary.js';
import sharp from 'sharp';
import { PassThrough } from 'stream';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Optimization with Sharp
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Upload to Cloudinary using stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'journey',
                resource_type: 'image',
                format: 'webp',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Cloudinary upload failed', error });
                }
                res.status(200).json({
                    message: 'Image uploaded successfully',
                    url: result?.secure_url,
                    public_id: result?.public_id,
                });
            }
        );

        const bufferStream = new PassThrough();
        bufferStream.end(optimizedBuffer);
        bufferStream.pipe(uploadStream);

    } catch (error: any) {
        console.error('Upload controller error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

import { Request, Response } from 'express';
import { cloudinary } from '../lib/cloudinary.js';
import sharp from 'sharp';
import { PassThrough } from 'stream';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';

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

        // Calculate hash of the optimized image
        const hash = crypto.createHash('sha256').update(optimizedBuffer as any).digest('hex');

        // Check if image already exists
        const existingFile = await prisma.uploadedFile.findUnique({
            where: { hash }
        });

        if (existingFile) {
            return res.status(200).json({
                message: 'Image retrieved from cache',
                url: existingFile.url,
                public_id: existingFile.publicId,
                hash: existingFile.hash,
                cached: true
            });
        }

        // Upload to Cloudinary using stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'journey',
                resource_type: 'image',
                format: 'webp',
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Cloudinary upload failed', error });
                }

                // Store in database with error handling for race conditions
                try {
                    await prisma.uploadedFile.create({
                        data: {
                            hash,
                            url: result?.secure_url || '',
                            publicId: result?.public_id || '',
                        }
                    });
                } catch (dbError: any) {
                    // If P2002 (Unique constraint failed), someone else just uploaded it
                    if (dbError.code !== 'P2002') {
                        console.error('Database error saving upload:', dbError);
                    }
                }

                res.status(200).json({
                    message: 'Image uploaded successfully',
                    url: result?.secure_url,
                    public_id: result?.public_id,
                    hash
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

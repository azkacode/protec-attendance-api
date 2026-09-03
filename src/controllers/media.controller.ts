import { Request, Response } from 'express';
import { Container } from 'typedi';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import crypto from 'crypto';
import path from 'path';

export default class MediaController {
  async upload(req: Request, res: Response) {
    const s3 = Container.get<S3Client>('s3');

    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      const file = req.file;

      const extension = path.extname(file.originalname);

      const fileName = `${crypto.randomUUID()}${extension}`;

      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const key = `attendance/${year}/${month}/${day}/${fileName}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: config.s3.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        })
      );

      const imageUrl =
        `${config.s3.endpoint}/${config.s3.bucketName}/${key}`;

      return res.status(200).json({
        imageUrl,
        key,
      });
    } catch (error: any) {
      console.error('S3 upload error:', error);

      return res.status(500).json({
        error: 'Error uploading file to Object Storage',
        message: error.message,
      });
    }
  }
}
import { Request, Response } from 'express';
import { Container } from 'typedi';

export default class MediaController  {
  
  
  async upload(req:Request, res:Response){
    const cloudinary : any = Container.get("cloudinary");
    try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error : any, result : any) => {
        if (error) {
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }
  
        // If successful, you can save the Cloudinary URL or other details in your database
        const imageUrl = result.secure_url;
        res.status(200).json({ imageUrl });
      }).end(req?.file?.buffer);
    } catch (error : any) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }
}

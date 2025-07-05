import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


const uploadOnCloudinary = async (filePath) => {
  
     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
        api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
    });
    try {
    
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath); 
       return uploadResult.secure_url; 
    } catch (error) {
         fs.unlinkSync(filePath); 
         return res.status(500).json({ message: "Cloudinary Error", error });
    }
}


export default uploadOnCloudinary;
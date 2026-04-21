import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";
import multer from "multer";
const storage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "compaliance_analysis",
        allowed_formats:["jpg","png","jprg","pdf","webp"]
    },

});
 export const upload = multer ({storage});
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "anime-store/products",
        allowed_formats: ["jpg", "png","jpeg", "webp"],
    },
});
export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
});


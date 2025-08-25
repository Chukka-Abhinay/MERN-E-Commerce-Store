import path from "path";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// Step 1: Configure Multer to store the file in memory
// This is a crucial change. It allows us to access the file as a buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
   const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
 const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// Step 2: Configure Cloudinary
// This code must be here to use your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Step 3: Change the route handler
// We will upload the file buffer to Cloudinary
router.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      // Upload the image to Cloudinary
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(req.file.buffer);
        });
        
        res.status(200).send({
          message: "Image uploaded successfully",
          // Send back the permanent Cloudinary URL
          image: result.secure_url,
        });
      } catch (uploadError) {
        res.status(500).send({ message: "Cloudinary upload failed", error: uploadError });
      }
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
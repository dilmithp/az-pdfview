import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // Optional if using CLOUDINARY_URL
  api_secret: process.env.CLOUDINARY_API_SECRET, // Optional if using CLOUDINARY_URL
});

// Since we have CLOUDINARY_URL in .env, Cloudinary SDK should pick it up automatically.
// But we'll export it for explicit use if needed.

export default cloudinary;

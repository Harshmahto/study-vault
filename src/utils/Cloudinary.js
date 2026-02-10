import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

//temp testing

cloudinary.config({
  cloud_name: "dmblroblz",
  api_key: "923785444127777",
  api_secret: "G5raPLWRf2tHi6_wqzfG9aqXWuQ"
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    console.log("Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",  // MUST be "raw" for PDFs
      folder: "study-vault-pdfs"
    });

    console.log("Upload successful:", response.secure_url);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;

  } catch (error) {
    console.error("Cloudinary error:", error);
    
    // Delete local file even if upload failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw"  // MUST be "raw" for PDFs
    });

    console.log("Delete response:", response);
    return response;

  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
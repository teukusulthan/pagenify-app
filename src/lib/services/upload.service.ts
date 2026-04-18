import { v2 as cloudinary } from "cloudinary";
import { UploadError } from "@/lib/utils/errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File
): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "pagenify/products",
          },
          (error, result) => {
            if (error || !result) {
              reject(new UploadError("Cloudinary upload failed"));
              return;
            }
            resolve(result.secure_url);
          }
        )
        .end(buffer);
    });
  } catch {
    throw new UploadError("Image upload failed");
  }
}

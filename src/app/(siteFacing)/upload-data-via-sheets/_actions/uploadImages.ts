import { cloudinary } from "@/cloudinary";
import axios from "axios";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

export async function fetchAndUploadImage(imageUrl: string) {
  try {
    // Search for image using Google Custom Search API

    // Create a readable stream from the image URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "stream",
    });

    // Create a promise that resolves with the Cloudinary upload result
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: process.env.CLOUDINARY_FOLDER_NAME,
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      // Pipe the image stream to the upload stream
      pipeline(imageResponse.data, uploadStream).catch(reject);
    });

    const uploadResponse = await uploadPromise;
    return {
      path: (uploadResponse as any).secure_url.replace(
        "/upload",
        "/upload/w_200",
      ),
      filename: (uploadResponse as any).public_id,
    };
  } catch (error) {
    console.error("Error searching and uploading image:", error);
    throw error;
  }
}

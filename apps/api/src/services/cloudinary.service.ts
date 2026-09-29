import crypto from "crypto";
import { env } from "../config/env";

export class CloudinaryService {
  /**
   * Uploads an image (base64 string or URL) to Cloudinary.
   * If real Cloudinary credentials are provided, uploads to Cloudinary API.
   * In development mode without API keys, provides a curated high-res placeholder URL.
   */
  static async uploadImage(
    imageData: string,
    folder = "indigo-thread/products"
  ): Promise<{ url: string; publicId: string }> {
    const isConfigured =
      env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET &&
      !env.CLOUDINARY_CLOUD_NAME.includes("placeholder");

    if (!isConfigured) {
      // Development mock fallback
      console.log("ℹ️ Cloudinary not configured with live keys. Using development image asset.");
      const mockImages = [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
      ];
      const randomUrl = mockImages[Math.floor(Math.random() * mockImages.length)];
      return {
        url: randomUrl,
        publicId: `dev_${Date.now()}`,
      };
    }

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      const formData = new URLSearchParams();
      formData.append("file", imageData);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("api_key", env.CLOUDINARY_API_KEY!);
      formData.append("signature", signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload failed: ${errorText}`);
      }

      const result = (await response.json()) as { secure_url: string; public_id: string };
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error: any) {
      console.error("Cloudinary upload exception:", error);
      throw { statusCode: 500, message: error.message || "Failed to upload image to Cloudinary" };
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../../services/cloudinary.service";
import { ApiResponse } from "../../utils/apiResponse";

export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { image, folder } = req.body;
      if (!image) {
        return ApiResponse.error(res, "Image data (base64 string or URL) is required", 400);
      }

      const uploadResult = await CloudinaryService.uploadImage(image, folder);
      return ApiResponse.success(res, uploadResult, "Image uploaded successfully");
    } catch (error) {
      next(error);
    }
  }
}

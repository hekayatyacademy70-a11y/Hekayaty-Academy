import { Router } from "express";
import { authenticate, requireAdmin, AuthUser } from "../middlewares/authenticate";
import { AssetsService } from "../services/assets.service";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const assetsRouter = Router();
const assetsService = new AssetsService();

// Configure Cloudinary globally (reads from CLOUDINARY_URL in .env)
cloudinary.config(true);

// Allowed MIME types for uploads
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);
const MAX_FILE_SIZE_MB = 200; // 200MB limit

// Configure multer with size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Allowed: images, videos, PDF.`));
    }
  },
});

// Require authentication for all asset endpoints
assetsRouter.use(authenticate);

/**
 * POST /api/assets/upload
 * Uploads a file directly to Cloudinary and returns the URL.
 */
assetsRouter.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // Upload to Cloudinary using a stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "hekayaty-academy",
          resource_type: "auto", // auto detects image/video
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Register asset in our database
    const dbAsset = await assetsService.registerAsset({
      uploaderId: user.userId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      category: "misc", // you can make this dynamic via req.body
      provider: "cloudinary",
      providerId: uploadResult.public_id,
      providerUrl: uploadResult.secure_url,
    });

    res.json({
      success: true,
      assetId: dbAsset.assetId,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("[Upload Error]:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * POST /api/assets/register
 */
assetsRouter.post("/register", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { fileName, mimeType, fileSizeBytes, category, provider, providerId, providerUrl } = req.body;

    const result = await assetsService.registerAsset({
      uploaderId: user.userId,
      fileName,
      mimeType,
      fileSizeBytes,
      category,
      provider: provider || "cloudinary",
      providerId,
      providerUrl,
    });

    res.json({ success: true, assetId: result.assetId });
  } catch (error) {
    next(error);
  }
});

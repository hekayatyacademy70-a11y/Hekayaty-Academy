import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export interface GenerateUploadUrlParams {
  fileName: string;
  mimeType: string;
  category: "video" | "thumbnail" | "avatar" | "manuscript" | "submission" | "document" | "misc";
  isPrivate?: boolean;
}

export class StorageService {
  private client: S3Client | null = null;
  private bucketName: string = "";
  private publicDomain: string = "";
  private initialized = false;

  constructor() {
    if (
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME
    ) {
      this.bucketName = process.env.R2_BUCKET_NAME;
      this.publicDomain = process.env.R2_PUBLIC_DOMAIN || "";
      this.client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      });
      this.initialized = true;
    } else {
      console.warn("StorageService: R2 credentials not configured. File upload endpoints will be unavailable.");
    }
  }

  private requireClient(): S3Client {
    if (!this.client || !this.initialized) {
      throw new Error("R2 storage is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME environment variables.");
    }
    return this.client;
  }

  /**
   * Generates a presigned URL for direct client-to-R2 upload
   */
  async generateUploadUrl(params: GenerateUploadUrlParams): Promise<{ uploadUrl: string; objectKey: string }> {
    // Sanitize filename and create a unique object key
    const ext = path.extname(params.fileName);
    const uniqueId = uuidv4();
    const safeName = path.basename(params.fileName, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Structure: category/year/month/uuid-filename.ext
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const objectKey = `${params.category}/${year}/${month}/${uniqueId}-${safeName}${ext}`;

    const client = this.requireClient();
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      ContentType: params.mimeType,
    });

    // URL valid for 15 minutes
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

    return { uploadUrl, objectKey };
  }

  /**
   * Generates a temporary access URL for private assets
   */
  async generateDownloadUrl(objectKey: string, expiresInSeconds: number = 3600): Promise<string> {
    const client = this.requireClient();
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  }

  /**
   * Returns the public CDN URL for public assets
   */
  getPublicUrl(objectKey: string): string {
    if (!this.publicDomain) {
      throw new Error("R2_PUBLIC_DOMAIN is not configured for public assets");
    }
    // Remove trailing slash from domain if present
    const domain = this.publicDomain.replace(/\/$/, "");
    return `${domain}/${objectKey}`;
  }
}

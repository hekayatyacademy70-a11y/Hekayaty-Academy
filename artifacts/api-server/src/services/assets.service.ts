import { supabase } from "../lib/supabase";

export interface RegisterAssetDto {
  uploaderId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  category: "video" | "thumbnail" | "avatar" | "manuscript" | "submission" | "document" | "misc";
  provider: "cloudinary" | "youtube" | "r2" | "local";
  providerId: string;
  providerUrl: string;
}

export class AssetsService {
  /**
   * Registers a successfully uploaded asset in the database
   */
  async registerAsset(data: RegisterAssetDto): Promise<{ assetId: string }> {
    const { data: asset, error } = await supabase
      .from("assets")
      .insert({
        uploader_id: data.uploaderId,
        file_name: data.fileName,
        mime_type: data.mimeType,
        file_size_bytes: data.fileSizeBytes,
        asset_category: data.category,
        provider: data.provider,
        provider_id: data.providerId,
        provider_url: data.providerUrl,
        status: "uploaded",
        visibility: "public",
      })
      .select("id")
      .single();

    if (error || !asset) throw new Error(`Failed to register asset: ${error?.message}`);
    return { assetId: asset.id };
  }

  /**
   * Get an asset by ID
   */
  async getAssetById(id: string) {
    const { data: asset } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();
    return asset;
  }
}

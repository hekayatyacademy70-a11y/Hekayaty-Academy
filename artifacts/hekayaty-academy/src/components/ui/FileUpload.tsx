import { useState, useRef } from "react";
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useRegisterAsset } from "@workspace/api-client-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";
import axios from "axios";

export interface FileUploadProps {
  category: "video" | "thumbnail" | "avatar" | "manuscript" | "submission" | "document" | "misc";
  visibility?: "public" | "private"; // Ignored for now since Cloudinary uploads are all public by default in unsigned mode
  accept?: string;
  maxSizeMB?: number;
  onUploadSuccess?: (assetId: string, objectKey: string, publicUrl?: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export function FileUpload({
  category,
  visibility = "private",
  accept,
  maxSizeMB = 10,
  onUploadSuccess,
  onUploadError,
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "registering" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useRegisterAsset();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > maxSizeMB * 1024 * 1024) {
      const err = `حجم الملف يتجاوز الحد الأقصى المسموح (${maxSizeMB}MB)`;
      setErrorMsg(err);
      setStatus("error");
      onUploadError?.(err);
      return;
    }

    setFile(selected);
    setStatus("idle");
    setErrorMsg("");
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || cloudName === "YOUR_CLOUDINARY_CLOUD_NAME") {
      const err = "إعدادات Cloudinary غير متوفرة. الرجاء إضافتها في ملف البيئة.";
      setStatus("error");
      setErrorMsg(err);
      onUploadError?.(err);
      return;
    }

    setStatus("uploading");
    setProgress(5);

    try {
      // 1. Direct Unsigned Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const response = await axios.post(cloudinaryUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Allocate 90% of progress bar to the actual upload
            const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total) + 5;
            setProgress(percentCompleted);
          }
        },
      });

      const { public_id, secure_url, bytes, format } = response.data;

      // 2. Register Asset in our Database
      setStatus("registering");
      setProgress(95);

      const registerResponse = await registerMutation.mutateAsync({
        data: {
          fileName: file.name,
          mimeType: file.type || `image/${format}`,
          fileSizeBytes: bytes,
          category,
          provider: "cloudinary",
          providerId: public_id,
          providerUrl: secure_url,
        }
      });

      setProgress(100);
      setStatus("success");
      
      // 3. Callback
      onUploadSuccess?.(registerResponse.assetId || "", public_id, secure_url);

    } catch (error: any) {
      console.error("Upload failed", error);
      const err = error?.response?.data?.error?.message || error.message || "حدث خطأ أثناء الرفع";
      setStatus("error");
      setErrorMsg(err);
      onUploadError?.(err);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
          (status === "uploading" || status === "registering") ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          status === "success" && "border-green-500/50 bg-green-500/5",
          status === "error" && "border-red-500/50 bg-red-500/5"
        )}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          disabled={status === "uploading" || status === "registering" || status === "success"}
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">انقر لاختيار ملف أو اسحبه هنا</p>
              <p className="text-xs text-muted-foreground">
                الحد الأقصى للحجم: {maxSizeMB}MB
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => inputRef.current?.click()}
            >
              تصفح الملفات
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center space-x-3 space-x-reverse overflow-hidden">
                <File className="w-8 h-8 text-primary shrink-0" />
                <div className="text-right truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {status === "idle" && (
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
              {status === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
            </div>

            {(status === "uploading" || status === "registering") && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{status === "registering" ? "جاري التسجيل..." : "جاري الرفع..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {status === "error" && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}

            {status === "idle" && (
              <Button onClick={handleUpload} className="w-full">
                بدء الرفع
              </Button>
            )}

            {status === "success" && (
              <Button variant="outline" onClick={() => {
                setFile(null);
                setStatus("idle");
              }} className="w-full">
                رفع ملف آخر
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

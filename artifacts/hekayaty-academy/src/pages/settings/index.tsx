import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateAuthMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetAuthMeQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Save, User, Mail, BookOpen, Shield } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const BUCKET = "avatars";

async function uploadToSupabase(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "فشل رفع الصورة");
  }

  // Build the public URL
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  return publicUrl;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateMutation = useUpdateAuthMe();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || null);
    }
  }, [user]);

  const handleAvatarClick = () => {
    if (!avatarUploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "خطأ", description: "حجم الصورة يتجاوز 5MB" });
      return;
    }

    // Show immediate preview
    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);
    setAvatarUploading(true);

    try {
      const publicUrl = await uploadToSupabase(file, user.id);
      setAvatarUrl(publicUrl);
      // Auto-save avatar immediately after upload
      await updateMutation.mutateAsync({
        data: { name, bio, avatarUrl: publicUrl },
      });
      queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
      toast({ title: "✅ تم رفع الصورة", description: "تم تحديث صورتك الشخصية بنجاح" });
    } catch (err: any) {
      // Revert preview
      setAvatarUrl(user.avatarUrl || null);
      toast({ variant: "destructive", title: "خطأ", description: err.message || "فشل رفع الصورة" });
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ variant: "destructive", title: "خطأ", description: "الاسم لا يمكن أن يكون فارغاً" });
      return;
    }
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        data: { name, bio, avatarUrl: avatarUrl || undefined },
      });
      queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
      toast({ title: "✅ تم الحفظ", description: "تم تحديث معلوماتك بنجاح" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "خطأ", description: err.message || "فشل حفظ البيانات" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U";

  const roleLabel: Record<string, string> = {
    instructor: "مدرب",
    student: "متدرب",
    admin: "مدير",
    superadmin: "مدير عام",
    reviewer: "محكّم",
    parent: "ولي أمر",
    guest: "زائر",
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">الإعدادات الشخصية</h1>
        <p className="text-muted-foreground text-sm mt-1">
          قم بتحديث معلوماتك الشخصية وصورتك
        </p>
      </div>

      {/* Avatar Card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-6">
          {/* Avatar Clickable */}
          <div className="relative shrink-0 group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-lg flex items-center justify-center">
              {avatarUrl && !avatarUrl.startsWith("blob:") ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl(null)}
                />
              ) : avatarUrl && avatarUrl.startsWith("blob:") ? (
                <img src={avatarUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary/70">{initials}</span>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {avatarUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate">{user.name}</p>
            <p className="text-muted-foreground text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" />
                {roleLabel[user.role] || user.role}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                <BookOpen className="w-3 h-3" />
                {user.subscriptionTier}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {avatarUploading ? "جاري رفع الصورة..." : "انقر على الصورة لتغييرها • JPG, PNG, WEBP — بحد أقصى 5MB"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-semibold text-base border-b border-border pb-3">المعلومات الأساسية</h2>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            الاسم بالكامل
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="text-right"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded mr-1">لا يمكن التغيير</span>
          </Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="text-right opacity-60 cursor-not-allowed"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">
            نبذة تعريفية
            <span className="text-muted-foreground text-xs mr-2">(اختياري)</span>
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="اكتب نبذة قصيرة عن نفسك، تخصصك، أو ما الذي تقدمه..."
            className="text-right resize-none h-28"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground text-left">{bio.length} / 300</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || avatarUploading}
          size="lg"
          className="min-w-36 gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

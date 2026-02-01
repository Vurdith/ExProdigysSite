"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Check } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  bucket?: string;
}

export function ImageUpload({ onUpload, currentUrl, bucket = "site-assets" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      
      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center group ring-1 ring-white/5">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer p-3 rounded-full bg-white text-black">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-4 text-white/40 hover:text-white transition-colors">
            <Upload className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {uploading ? "Uploading..." : "Upload Asset"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {preview && (
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-green-500">
          <Check className="w-3 h-3" />
          Asset Linked
        </div>
      )}
    </div>
  );
}

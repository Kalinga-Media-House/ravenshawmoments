"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadProfileGalleryImageAction } from "@/app/actions/profile";
import { toast } from "sonner";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";

export interface GalleryUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  currentCount?: number;
  maxCount?: number;
}

export function GalleryUploader({
  open,
  onOpenChange,
  onSuccess,
  currentCount = 0,
  maxCount = 50,
}: GalleryUploaderProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/heif", "image/heic"].includes(selected.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, WEBP, or HEIC images.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds the maximum limit of 10 MB.");
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image file first.");
      return;
    }

    if (currentCount >= maxCount) {
      toast.error(`Gallery quota reached (${maxCount} max photos). Delete some photos before uploading more.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      const res = await uploadProfileGalleryImageAction(formData);
      if (res.success) {
        toast.success("Photo uploaded to gallery successfully!");
        setFile(null);
        setPreviewUrl(null);
        setCaption("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error?.message || "Failed to upload photo.");
      }
    } catch {
      toast.error("Unexpected network error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            <span>Upload Profile Photo</span>
          </DialogTitle>
          <DialogDescription>
            Add a new photo to your personal showcase ({currentCount} / {maxCount} photos used).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Select Image File (Max 10 MB)</Label>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/20 p-6 transition-colors hover:border-primary/50 cursor-pointer">
              {previewUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2 text-xs h-7"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="flex flex-col items-center justify-center cursor-pointer w-full text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Click to upload photo</span>
                  <span className="text-xs text-muted-foreground mt-0.5">JPEG, PNG, WEBP, HEIC up to 10MB</span>
                </label>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heif,image/heic"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Photo Caption (Optional)</Label>
            <Textarea
              id="caption"
              placeholder="Write a short description or memory title..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isUploading}
              maxLength={250}
              className="h-20"
            />
            <div className="text-right text-[11px] text-muted-foreground">
              {caption.length} / 250 characters
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUploading} className="gap-2">
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

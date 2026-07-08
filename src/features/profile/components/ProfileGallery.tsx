"use client";

import * as React from "react";
import { ProfileGalleryItem } from "@/types/profile";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryUploader } from "./GalleryUploader";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { deleteProfileGalleryImageAction } from "@/app/actions/profile";
import { toast } from "sonner";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileGalleryProps {
  items: ProfileGalleryItem[];
  isOwner?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function ProfileGallery({
  items = [],
  isOwner = false,
  onRefresh,
  className,
}: ProfileGalleryProps) {
  const [uploaderOpen, setUploaderOpen] = React.useState(false);

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this photo from your gallery?")) return;

    try {
      const res = await deleteProfileGalleryImageAction(itemId);
      if (res.success) {
        toast.success("Photo removed successfully.");
        onRefresh?.();
      } else {
        toast.error(res.error?.message || "Failed to delete photo.");
      }
    } catch {
      toast.error("Network error while deleting photo.");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span>Profile Gallery ({items.length} / 50)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            A personal visual showcase of moments and campus memories.
          </p>
        </div>

        {isOwner && items.length < 50 && (
          <Button
            size="sm"
            onClick={() => setUploaderOpen(true)}
            className="gap-1.5 shadow-xs font-medium"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Add Photo</span>
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No photos in gallery yet"
          description={
            isOwner
              ? "Share your memorable campus highlights by uploading your first photo."
              : "This user has not uploaded any photos to their gallery yet."
          }
          icon={ImageIcon}
          actionLabel={isOwner ? "Upload Photo" : undefined}
          onAction={isOwner ? () => setUploaderOpen(true) : undefined}
        />
      ) : (
        <GalleryGrid items={items} isOwner={isOwner} onDelete={handleDelete} />
      )}

      {isOwner && (
        <GalleryUploader
          open={uploaderOpen}
          onOpenChange={setUploaderOpen}
          onSuccess={onRefresh}
          currentCount={items.length}
        />
      )}
    </div>
  );
}

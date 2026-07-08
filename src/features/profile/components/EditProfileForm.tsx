"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBasicProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Edit2, Loader2, Image as ImageIcon } from "lucide-react";

export interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultValues: {
    full_name: string;
    username: string;
    bio?: string | null;
    gender?: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;
  };
}

export function EditProfileForm({
  open,
  onOpenChange,
  onSuccess,
  defaultValues,
}: EditProfileFormProps) {
  const [fullName, setFullName] = React.useState(defaultValues.full_name || "");
  const [username, setUsername] = React.useState(defaultValues.username || "");
  const [bio, setBio] = React.useState(defaultValues.bio || "");
  const [gender, setGender] = React.useState(defaultValues.gender || "");
  const [avatarUrl, setAvatarUrl] = React.useState(defaultValues.avatar_url || "");
  const [coverUrl, setCoverUrl] = React.useState(defaultValues.cover_url || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      toast.error("Full name and username are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("username", username.trim());
      formData.append("bio", bio.trim());
      if (gender) formData.append("gender", gender);
      if (avatarUrl.trim()) formData.append("avatar_url", avatarUrl.trim());
      if (coverUrl.trim()) formData.append("cover_url", coverUrl.trim());

      const res = await updateBasicProfile(formData);
      if (res.success) {
        toast.success("Profile updated successfully!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error?.message || "Failed to update profile.");
      }
    } catch {
      toast.error("Network error while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Edit2 className="h-5 w-5 text-primary" />
            <span>Edit Profile Identity</span>
          </DialogTitle>
          <DialogDescription>
            Update how your name, handle, and bio appear across Ravenshaw Moments.
          </DialogDescription>
        </DialogHeader>

        <form key={open ? "open" : "closed"} onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Ananya Rath"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username Handle *</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm text-muted-foreground select-none">@</span>
                <Input
                  id="edit-username"
                  placeholder="ananya"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  disabled={isSubmitting}
                  required
                  className="pl-7 lowercase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bio">Biography</Label>
            <Textarea
              id="edit-bio"
              placeholder="Tell your campus story, club passions, or favorite hangout spots..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
              maxLength={300}
              className="h-24"
            />
            <div className="text-right text-[11px] text-muted-foreground">
              {bio.length} / 300 characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-gender">Gender</Label>
            <select
              id="edit-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="pt-2 border-t border-border/40 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              <span>Media URLs (Optional)</span>
            </h4>

            <div className="space-y-2">
              <Label htmlFor="edit-avatar">Avatar Photo URL</Label>
              <Input
                id="edit-avatar"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                disabled={isSubmitting}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cover">Cover Banner URL</Label>
              <Input
                id="edit-cover"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                disabled={isSubmitting}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!fullName.trim() || !username.trim() || isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? "Saving Changes..." : "Save Profile"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

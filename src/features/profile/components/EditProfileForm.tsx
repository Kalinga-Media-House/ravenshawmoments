"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBasicProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Edit2, Loader2 } from "lucide-react";
import { GenderCombobox } from "@/components/forms/GenderCombobox";

export interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultValues: {
    full_name: string;
    username: string;
    bio?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
  };
}

export function EditProfileForm({
  open,
  onOpenChange,
  onSuccess,
  defaultValues,
}: EditProfileFormProps) {
  const [fullName, setFullName] = React.useState(defaultValues.full_name || "");
  const [username, setUsername] = React.useState((defaultValues.username || "").replace(/^@+/, ""));
  const [bio, setBio] = React.useState(defaultValues.bio || "");
  const [gender, setGender] = React.useState(defaultValues.gender || "");
  const [dateOfBirth, setDateOfBirth] = React.useState(defaultValues.date_of_birth || "");
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
      if (dateOfBirth) formData.append("date_of_birth", dateOfBirth);

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
            <GenderCombobox
              value={gender}
              onChange={setGender}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dob">Date of Birth</Label>
            <Input
              id="edit-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!fullName.trim() || !username.trim() || isSubmitting} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? "Saving Changes..." : "Save Profile"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

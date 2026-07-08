"use client";

import * as React from "react";
import { ProfilePrivacySettings, ProfileVisibility } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updatePrivacySettings } from "@/app/actions/profile";
import { toast } from "sonner";
import { Lock, Globe, Users, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PrivacySettingsCardProps {
  initialSettings?: ProfilePrivacySettings;
  onSuccess?: () => void;
  className?: string;
}

const visibilityOptions: { value: ProfileVisibility; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "public", label: "Public (Everyone)", icon: Globe, desc: "Visible to anyone on or off the campus network." },
  { value: "ravenshaw_only", label: "Ravenshaw Only", icon: Users, desc: "Visible exclusively to logged-in students and faculty." },
  { value: "private", label: "Private (Only Me)", icon: Lock, desc: "Hidden from everyone except you and administrators." },
];

export function PrivacySettingsCard({
  initialSettings,
  onSuccess,
  className,
}: PrivacySettingsCardProps) {
  const [settings, setSettings] = React.useState<Record<string, ProfileVisibility>>({
    profile_visibility: initialSettings?.profile_visibility || "public",
    email_visibility: initialSettings?.email_visibility || "private",
    phone_visibility: initialSettings?.phone_visibility || "private",
    dob_visibility: initialSettings?.dob_visibility || "private",
    gallery_visibility: initialSettings?.gallery_visibility || "public",
    achievements_visibility: initialSettings?.achievements_visibility || "public",
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (field: string, val: ProfileVisibility) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([k, v]) => formData.append(k, v));

      const res = await updatePrivacySettings(formData);
      if (res.success) {
        toast.success("Privacy preferences updated successfully!");
        onSuccess?.();
      } else {
        toast.error(res.error?.message || "Failed to update privacy preferences.");
      }
    } catch {
      toast.error("Network error while saving privacy settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderSelect = (label: string, field: string, desc: string) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/40 last:border-none">
      <div className="space-y-0.5 max-w-sm">
        <Label htmlFor={field} className="text-sm font-semibold text-foreground">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>

      <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg shrink-0">
        {visibilityOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = settings[field] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange(field, opt.value)}
              disabled={isSaving}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                isSelected
                  ? "bg-background text-foreground shadow-2xs font-semibold ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={opt.desc}
            >
              <Icon className="h-3 w-3" />
              <span>{opt.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className={cn("border bg-card shadow-xs", className)}>
      <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>Granular Privacy & Visibility Controls</span>
        </CardTitle>
        <CardDescription>
          Choose who can view your personal contact details, campus photos, and student achievements.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-2">
          {renderSelect("Overall Profile", "profile_visibility", "Control overall visibility of your profile identity in campus search.")}
          {renderSelect("Email Address", "email_visibility", "Control who can view your registered email address on your card.")}
          {renderSelect("Phone Number", "phone_visibility", "Control who can view your contact number for club coordination.")}
          {renderSelect("Date of Birth", "dob_visibility", "Control who can see your birth date and age celebrations.")}
          {renderSelect("Profile Gallery", "gallery_visibility", "Control who can browse your 50-photo campus showcase.")}
          {renderSelect("Achievements", "achievements_visibility", "Control who can see your competition awards and honors.")}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/40 flex justify-end">
          <Button type="submit" disabled={isSaving} className="gap-2 shadow-xs">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSaving ? "Saving Changes..." : "Save Privacy Settings"}</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSocialLinks } from "@/actions/student/profile.actions";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Save,
  Loader2,
  ExternalLink,
  Briefcase,
  Youtube,
  Facebook,
} from "lucide-react";

interface Props {
  profileId: string;
  initialLinks: Record<string, string>;
  website: string;
}

const socialPlatforms = [
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
    color: "text-gray-400",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
    color: "text-blue-500",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: Twitter,
    placeholder: "https://x.com/username",
    color: "text-sky-400",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
    color: "text-pink-500",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/username",
    color: "text-blue-600",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@channel",
    color: "text-red-500",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    icon: Briefcase,
    placeholder: "https://myportfolio.com",
    color: "text-amber-500",
  },
  {
    key: "website",
    label: "Personal Website",
    icon: Globe,
    placeholder: "https://mysite.com",
    color: "text-emerald-500",
  },
];

export function SocialLinksPageClient({ profileId, initialLinks, website }: Props) {
  const [links, setLinks] = useState<Record<string, string>>({
    ...initialLinks,
    website: website || initialLinks.website || "",
  });
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSocialLinks(links);
      if (result.success) {
        toast.success("Social links updated");
        setHasChanges(false);
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  const filledCount = Object.values(links).filter((v) => v.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your online presence ({filledCount} of {socialPlatforms.length} linked)
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {socialPlatforms.map((platform) => {
          const IconComp = platform.icon;
          const currentValue = links[platform.key] || "";
          const isLinked = currentValue.trim().length > 0;

          return (
            <div
              key={platform.key}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/5"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  isLinked ? "bg-primary/10" : "bg-muted/20"
                }`}
              >
                <IconComp
                  size={20}
                  className={isLinked ? platform.color : "text-muted-foreground"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  {platform.label}
                </label>
                <input
                  type="url"
                  value={currentValue}
                  onChange={(e) => handleChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              {isLinked && (
                <a
                  href={currentValue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title={`Visit ${platform.label}`}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {hasChanges && (
        <div className="text-xs text-amber-500">You have unsaved changes</div>
      )}
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateDepartment, publishDepartment, archiveDepartment } from "@/actions/department/department.actions";
import { useDepartmentAdmin } from "../context";
import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Save, Globe, Archive, Eye, Loader2 } from "lucide-react";

const settingsSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters").max(255),
  shortName: z.string().max(50).optional(),
  slug: z.string().optional(),
  establishedYear: z.coerce.number().min(1868).max(new Date().getFullYear()).optional(),
  vision: z.string().max(2000).optional(),
  mission: z.string().max(2000).optional(),
  about: z.string().optional(),
  history: z.string().optional(),
  coreValues: z.string().optional(),
  highlights: z.string().optional(),
  quickFacts: z.string().optional(),
  officeInfo: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsPageClientProps {
  initialData: any;
}

export function SettingsPageClient({ initialData }: SettingsPageClientProps) {
  const { departmentId, slug } = useDepartmentAdmin();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"general" | "about" | "contact" | "social">("general");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as unknown as import("react-hook-form").Resolver<SettingsFormData>,
    defaultValues: {
      name: initialData?.name || "",
      shortName: initialData?.short_name || "",
      slug: initialData?.slug || "",
      establishedYear: initialData?.established_year || undefined,
      vision: initialData?.vision || "",
      mission: initialData?.mission || "",
      about: initialData?.about || "",
      history: initialData?.history || "",
      coreValues: initialData?.core_values || "",
      highlights: initialData?.highlights || "",
      quickFacts: initialData?.quick_facts || "",
      officeInfo: initialData?.office_info || "",
      contactEmail: initialData?.contact_email || "",
      contactPhone: initialData?.contact_phone || "",
      website: initialData?.website || "",
      socialLinks: initialData?.social_links || {},
    },
  });

  const { isDirty, dirtyFields } = form.formState;

  // Autosave
  const watchedValues = form.watch();
  useEffect(() => {
    if (!isDirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave(watchedValues);
    }, 5000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [watchedValues, isDirty]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(
    (data: SettingsFormData) => {
      startTransition(async () => {
        const result = await updateDepartment(departmentId, slug, data);
        if (result.success) {
          setLastSaved(new Date());
          form.reset(data);
          toast.success("Settings saved");
        } else {
          toast.error(result.error || "Failed to save");
        }
      });
    },
    [departmentId, slug, form]
  );

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishDepartment(departmentId, slug);
      if (result.success) {
        toast.success("Department published");
      } else {
        toast.error(result.error || "Failed to publish");
      }
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      const result = await archiveDepartment(departmentId, slug);
      if (result.success) {
        toast.success("Department archived");
      } else {
        toast.error(result.error || "Failed to archive");
      }
    });
  };

  const tabs = [
    { key: "general" as const, label: "General" },
    { key: "about" as const, label: "About & Content" },
    { key: "contact" as const, label: "Contact & Office" },
    { key: "social" as const, label: "Social Links" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5E6EA]">Department Settings</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-[#8B7078]">
              Manage department profile and configuration
            </p>
            {lastSaved && (
              <span className="text-xs text-emerald-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {isDirty && (
              <span className="text-xs text-amber-400">Unsaved changes</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
          >
            <Globe size={16} />
            Publish
          </button>
          <button
            // @ts-ignore
            onClick={form.handleSubmit(handleSave)}
            disabled={isPending || !isDirty}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7C2D3E] to-[#9B3A4D] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[#2D1F23] bg-[#1A1214] p-1">
        {tabs.map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[#7C2D3E] to-[#9B3A4D] text-white shadow-sm"
                : "text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      // @ts-ignore
      <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(handleSave)(e); }} className="space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Department Name *</label>
                <input
                  {...form.register("name")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="e.g. Computer Science"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Short Name</label>
                <input
                  {...form.register("shortName")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="e.g. CS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Slug</label>
                <input
                  {...form.register("slug")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] font-mono placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="computer-science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Established Year</label>
                <input
                  type="number"
                  {...form.register("establishedYear")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="1868"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">Vision</label>
              <textarea
                {...form.register("vision")}
                rows={3}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="Department vision statement..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">Mission</label>
              <textarea
                {...form.register("mission")}
                rows={3}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="Department mission statement..."
              />
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">About</label>
              <textarea
                {...form.register("about")}
                rows={6}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="About the department..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">History</label>
              <textarea
                {...form.register("history")}
                rows={6}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="Department history..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Core Values</label>
                <textarea
                  {...form.register("coreValues")}
                  rows={4}
                  className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                  placeholder="One value per line..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Highlights</label>
                <textarea
                  {...form.register("highlights")}
                  rows={4}
                  className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                  placeholder="Key highlights..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">Quick Facts</label>
              <textarea
                {...form.register("quickFacts")}
                rows={4}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="Quick facts about the department..."
              />
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Contact Email</label>
                <input
                  type="email"
                  {...form.register("contactEmail")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="dept@ravenshaw.edu.in"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Contact Phone</label>
                <input
                  type="tel"
                  {...form.register("contactPhone")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#F5E6EA]">Website</label>
                <input
                  type="url"
                  {...form.register("website")}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder="https://cs.ravenshaw.edu.in"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5E6EA]">Office Information</label>
              <textarea
                {...form.register("officeInfo")}
                rows={4}
                className="flex w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors resize-none"
                placeholder="Room number, building, office hours..."
              />
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
            {["facebook", "twitter", "instagram", "linkedin", "youtube"].map((platform: any) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm font-medium text-[#F5E6EA] capitalize">{platform}</label>
                <input
                  // @ts-ignore
                  {...form.register(`socialLinks.${platform as any}`)}
                  className="flex h-10 w-full rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-2 text-sm text-[#F5E6EA] placeholder-[#8B7078] focus:border-[#9B3A4D] focus:outline-none focus:ring-1 focus:ring-[#9B3A4D] transition-colors"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-[#8B7078] mb-4">
          Archiving will hide this department from the public website.
        </p>
        <button
          onClick={handleArchive}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
        >
          <Archive size={16} />
          Archive Department
        </button>
      </div>
    </div>
  );
}

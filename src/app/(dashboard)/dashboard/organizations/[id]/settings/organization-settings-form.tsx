"use client";

import { useState, useTransition } from "react";
import { updateOrganizationAction } from "@/app/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function OrganizationSettingsForm({ org }: { org: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: org.name || "",
    description: org.description || "",
    contact_email: org.contact_email || "",
    contact_phone: org.contact_phone || "",
    website_url: org.website_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateOrganizationAction(org.id, formData);
      if (res.success) {
        toast.success("Organization settings updated successfully.");
      } else {
        toast.error(res.error?.message || "Failed to update settings.");
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Organization Name</label>
        <Input 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Email</label>
          <Input 
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Phone</label>
          <Input 
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Website URL</label>
        <Input 
          type="url"
          name="website_url"
          value={formData.website_url}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full md:w-auto bg-[#800000] hover:bg-red-900 text-white">
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}

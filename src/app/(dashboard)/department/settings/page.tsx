"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDepartmentSchema } from "@/lib/validation/department";
import { updateDepartment } from "@/actions/department/department.actions";
import { useState, useTransition } from "react";

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: "",
      shortName: "",
      establishedYear: 1868,
      vision: "",
      mission: "",
    }
  });

  const onSubmit = (data: any) => {
    setMessage("");
    startTransition(async () => {
      // Hardcoded dept ID for demo. Real app reads from context/URL.
      const res = await updateDepartment("123e4567-e89b-12d3-a456-426614174000", "cs", data);
      if (res.success) {
        setMessage("Settings updated successfully!");
      } else {
        setMessage(res.error || "Failed to update");
      }
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Department Name</label>
              <input {...form.register("name")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Vision</label>
              <textarea {...form.register("vision")} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Mission</label>
              <textarea {...form.register("mission")} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            
            <button disabled={isPending} type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


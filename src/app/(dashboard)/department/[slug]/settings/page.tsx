import { requireAuth } from "@/auth/guards/require-auth";
import { getDepartment } from "@/actions/department/department.actions";
import { SettingsPageClient } from "./settings-client";

interface PageProps {
  params: { slug: string };
}

export default async function SettingsPage({ params }: PageProps) {
  await requireAuth();
  const result = await getDepartment(params.slug);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#8B7078]">Failed to load department settings.</p>
      </div>
    );
  }

  return <SettingsPageClient initialData={result.data} />;
}

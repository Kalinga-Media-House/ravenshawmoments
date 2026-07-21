import React from "react";
import { getOrganizationByIdAction } from "@/app/actions/organization";
import { notFound } from "next/navigation";
import { OrganizationSettingsForm } from "./organization-settings-form";
import { Card } from "@/components/ui/card";

export default async function OrganizationSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orgRes = await getOrganizationByIdAction(resolvedParams.id);
  
  if (!orgRes.success || !orgRes.data) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update the profile and details of your organization.</p>
      </div>

      <Card className="p-6">
        <OrganizationSettingsForm org={orgRes.data} />
      </Card>
    </div>
  );
}
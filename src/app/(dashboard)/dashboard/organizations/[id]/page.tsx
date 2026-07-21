import React from "react";
import { getOrganizationByIdAction } from "@/app/actions/organization";
import { Card } from "@/components/ui/card";
import { Users, Info, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function OrganizationDashboardOverview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getOrganizationByIdAction(resolvedParams.id);
  
  if (!res.success || !res.data) {
    notFound();
  }

  const org = res.data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{org.name} Overview</h1>
        <Link 
          href={`/dashboard/organizations/${org.id}/settings`}
          className={buttonVariants({ variant: "outline" })}
        >
          Edit Organization
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 text-[#800000] font-semibold text-lg">
            <Info className="w-5 h-5" />
            <h2>About</h2>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{org.description || 'No description provided.'}</p>
          
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 mt-4">
            {org.contact_email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" /> {org.contact_email}
              </div>
            )}
            {org.contact_phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" /> {org.contact_phone}
              </div>
            )}
            {org.social_links?.website && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" /> <a href={org.social_links.website} target="_blank" className="hover:underline text-blue-600">Website</a>
              </div>
            )}
            {org.established_year && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" /> Established: {org.established_year}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#800000] font-semibold text-lg mb-2">
            <Users className="w-5 h-5" />
            <h2>Quick Links</h2>
          </div>
          <div className="space-y-3">
            <Link 
              href={`/dashboard/organizations/${org.id}/members`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Manage Members
            </Link>
            <Link 
              href={`/dashboard/organizations/${org.id}/bearers`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Office Bearers
            </Link>
            <Link 
              href={`/dashboard/organizations/${org.id}/advisors`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Faculty Advisors
            </Link>
            <Link 
              href={`/dashboard/organizations/${org.id}/settings`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Settings
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

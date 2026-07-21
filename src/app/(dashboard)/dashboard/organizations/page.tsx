import React from "react";
import Link from "next/link";
import { getMyOrganizationsAction } from "@/app/actions/organization";
import { Card } from "@/components/ui/card";
import { Users, Settings, Plus, Building2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardOrganizationsPage() {
  const res = await getMyOrganizationsAction();
  const memberships = res.success && res.data ? res.data : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Organizations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the organizations you are a part of.</p>
        </div>
        <Link 
          href="/dashboard/organizations/create"
          className={cn(buttonVariants(), "bg-[#800000] hover:bg-red-900 text-white")}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Organization
        </Link>
      </div>

      {memberships.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No organizations found</h3>
          <p className="text-gray-500 mt-2 mb-6">You are not a member of any organizations yet.</p>
          <Link 
            href="/organizations"
            className={buttonVariants({ variant: "outline" })}
          >
            Explore Organizations
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership: any) => {
            const org = membership.organizations;
            if (!org) return null;
            return (
              <Card key={membership.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-50 text-[#800000] rounded-lg flex items-center justify-center font-bold">
                      {org.name?.substring(0, 2).toUpperCase() || 'OR'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{org.name}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded capitalize">
                        {membership.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                  {org.description || 'No description provided.'}
                </p>

                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/dashboard/organizations/${org.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                  >
                    Dashboard
                  </Link>
                  {(membership.role === 'admin' || membership.role === 'executive') && (
                    <Link 
                      href={`/dashboard/organizations/${org.id}/settings`}
                      className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

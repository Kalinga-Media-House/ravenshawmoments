import React from "react";
import { getOrganizationByIdAction, listActiveMembers } from "@/app/actions/organization";
import { Card } from "@/components/ui/card";
import { Users, Mail, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MemberActionsCell } from "./member-actions-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OrganizationMembersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orgRes = await getOrganizationByIdAction(resolvedParams.id);
  
  if (!orgRes.success || !orgRes.data) {
    notFound();
  }

  const membersRes = await listActiveMembers(resolvedParams.id);
  const members = membersRes.success && membersRes.data ? membersRes.data : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{orgRes.data.name} Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all active members of this organization.</p>
        </div>
        <Link 
          href={`/dashboard/organizations/${resolvedParams.id}/members/add`}
          className={cn(buttonVariants(), "bg-[#800000] hover:bg-red-900 text-white")}
        >
          Add Member
        </Link>
      </div>

      <Card className="overflow-hidden">
        {members.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900">No members found</h3>
            <p className="mt-2">There are no active members in this organization.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Member Details</TableHead>
                <TableHead>Role & Designation</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member: any) => {
                const profile = member.profiles || {};
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {profile.first_name} {profile.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            {profile.graduation_year && (
                              <span className="mr-2">Batch of {profile.graduation_year}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize font-medium text-gray-900">{member.role}</div>
                      {member.designation && (
                        <div className="text-sm text-gray-500">{member.designation}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <MemberActionsCell member={member} orgId={resolvedParams.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
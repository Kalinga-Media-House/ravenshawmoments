"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Edit2, Shield, Loader2, MoreHorizontal } from "lucide-react";
import { removeMemberAction, updateMemberRoleAction } from "@/app/actions/organization";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MemberActionsCell({ member, orgId }: { member: any; orgId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    
    startTransition(async () => {
      const res = await removeMemberAction(member.id, orgId);
      if (res.success) {
        toast.success("Member removed successfully.");
      } else {
        toast.error(res.error?.message || "Failed to remove member.");
      }
    });
  };

  const handleUpdateRole = (role: string) => {
    let designation = member.designation;
    if (role === "executive" || role === "office_bearer") {
      const newDesig = window.prompt("Enter new designation for this role:", designation || "");
      if (newDesig === null) return;
      designation = newDesig;
    }
    
    startTransition(async () => {
      const res = await updateMemberRoleAction(member.id, orgId, role, designation);
      if (res.success) {
        toast.success("Member role updated successfully.");
      } else {
        toast.error(res.error?.message || "Failed to update role.");
      }
    });
  };

  return (
    <div className="flex justify-end">
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleUpdateRole('member')}>
              <Edit2 className="w-4 h-4 mr-2" /> Make Member
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateRole('executive')}>
              <Shield className="w-4 h-4 mr-2" /> Make Executive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRemove} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" /> Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

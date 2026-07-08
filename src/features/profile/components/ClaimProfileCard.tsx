"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, GraduationCap } from "lucide-react";
import { ClaimProfileDialog } from "./ClaimProfileDialog";

export interface ClaimProfileCardProps {
  isProfileClaimed?: boolean;
  rollNumber?: string | null;
  registrationNumber?: string | null;
  className?: string;
}

export function ClaimProfileCard({
  isProfileClaimed = false,
  rollNumber,
  registrationNumber,
  className,
}: ClaimProfileCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Academic Roll Number Status</span>
            </CardTitle>
            <CardDescription>
              {isProfileClaimed
                ? "Your academic identity has been verified against university records."
                : "Claim your university roll number to receive your verified student badge."}
            </CardDescription>
          </div>
          {isProfileClaimed ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20 gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Claimed</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Unclaimed</span>
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {isProfileClaimed ? (
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              {rollNumber && (
                <div className="rounded-lg bg-muted px-3 py-1.5">
                  <span className="text-muted-foreground mr-1">Roll No:</span>
                  <span className="font-mono font-bold text-foreground">{rollNumber}</span>
                </div>
              )}
              {registrationNumber && (
                <div className="rounded-lg bg-muted px-3 py-1.5">
                  <span className="text-muted-foreground mr-1">Reg No:</span>
                  <span className="font-mono font-bold text-foreground">{registrationNumber}</span>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setOpen(true)}
              className="gap-2 font-medium"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Verify & Claim Roll Number</span>
            </Button>
          )}
        </CardContent>
      </Card>

      <ClaimProfileDialog
        open={open}
        onOpenChange={setOpen}
        defaultRollNumber={rollNumber || ""}
      />
    </>
  );
}

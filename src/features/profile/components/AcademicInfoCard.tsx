import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GraduationCap, Building2, BookOpen, Hash, CheckCircle2, AlertCircle } from "lucide-react";

export interface AcademicInfoCardProps {
  level?: string | null;
  stream?: string | null;
  departmentName?: string | null;
  programName?: string | null;
  batchYear?: string | null;
  universityName?: string | null;
  rollNumber?: string | null;
  registrationNumber?: string | null;
  isVerified?: boolean;
  isProfileClaimed?: boolean;
  className?: string;
}

export function AcademicInfoCard({
  level,
  stream,
  departmentName,
  programName,
  batchYear,
  universityName,
  rollNumber,
  registrationNumber,
  isVerified = false,
  isProfileClaimed = false,
  className,
}: AcademicInfoCardProps) {
  return (
    <Card className={cn("overflow-hidden heritage-card-glass", className)}>
      <CardHeader className="pb-3 border-b border-white/10 bg-white/5 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2 heritage-card-title">
          <GraduationCap className="h-4 w-4 heritage-icon" />
          <span>Academic Credentials</span>
        </CardTitle>

        {isVerified ? (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white gap-1 text-[11px] px-2 py-0.5 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            <span>Verified Student</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 text-[11px] px-2 py-0.5 font-medium text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <span>Unverified</span>
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {level === "+2" ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold heritage-card-muted">
                  Stream
                </div>
                <div className="text-sm font-semibold heritage-card-title mt-0.5">
                  {stream || <span className="heritage-card-muted font-normal italic">Not specified</span>}
                </div>
              </div>
            </div>
          ) : universityName ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none heritage-card-title mb-1.5">University / College Name</p>
                <p className="text-[13px] heritage-card-muted">{universityName}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold heritage-card-muted">
                  Department
                </div>
                <div className="text-sm font-semibold heritage-card-title mt-0.5">
                  {departmentName || <span className="heritage-card-muted font-normal italic">Not specified</span>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold heritage-card-muted">
                Course Program
              </div>
              <div className="text-sm font-semibold heritage-card-title mt-0.5">
                {programName || <span className="heritage-card-muted font-normal italic">Not specified</span>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold heritage-card-muted">
                Batch Year
              </div>
              <div className="text-sm font-semibold heritage-card-title mt-0.5">
                {batchYear ? `Batch of ${batchYear.replace('-', '–')}` : <span className="heritage-card-muted font-normal italic">Not specified</span>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0 mt-0.5">
              <Hash className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold heritage-card-muted">
                Roll Number
              </div>
              <div className="text-sm font-semibold heritage-card-title mt-0.5">
                {rollNumber ? (
                  <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-xs">{rollNumber}</span>
                ) : (
                  <span className="heritage-card-muted font-normal italic">Protected / Unclaimed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {registrationNumber && (
          <div className="pt-3 border-t border-white/10 text-xs heritage-card-muted flex items-center justify-between">
            <span>University Reg No.</span>
            <span className="font-mono font-medium heritage-card-title bg-white/10 px-1.5 py-0.5 rounded">
              {registrationNumber}
            </span>
          </div>
        )}

        {!isProfileClaimed && rollNumber && (
          <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <span>This student roll number has not been claimed yet.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { ProfileCertificate } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { Award, QrCode, ExternalLink, ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CertificateListProps {
  certificates: ProfileCertificate[];
  title?: string;
  description?: string;
  className?: string;
}

const formatCertType = (type: string) => {
  switch (type) {
    case "winner": return { label: "Winner", variant: "default" as const, color: "bg-amber-500 text-white" };
    case "runner_up": return { label: "Runner Up", variant: "default" as const, color: "bg-slate-500 text-white" };
    case "second_runner_up": return { label: "2nd Runner Up", variant: "default" as const, color: "bg-amber-700 text-white" };
    case "participation": return { label: "Participation", variant: "secondary" as const, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" };
    case "volunteer": return { label: "Volunteer", variant: "secondary" as const, color: "bg-green-500/10 text-green-600 dark:text-green-400" };
    default: return { label: type.replace(/_/g, " "), variant: "outline" as const, color: "" };
  }
};

export function CertificateList({
  certificates = [],
  title = "Verified Certificates",
  description = "Digital awards and recognition issued across Ravenshaw Moments.",
  className,
}: CertificateListProps) {
  if (!certificates.length) {
    return (
      <div className={cn("space-y-4", className)}>
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <EmptyState
          title="No certificates issued yet"
          description="Participate in university competitions, cultural fests, and leadership initiatives to earn verified digital certificates."
          icon={Award}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span>{title} ({certificates.length})</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => {
          const badgeInfo = formatCertType(cert.certificate_type);
          return (
            <Card key={cert.id} className="overflow-hidden border bg-card shadow-2xs transition-all hover:shadow-md flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase">
                        #{cert.certificate_number}
                      </span>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1">
                        {cert.title}
                      </h3>
                    </div>
                  </div>
                  <Badge className={cn("text-xs font-semibold shrink-0", badgeInfo.color)}>
                    {badgeInfo.label}
                  </Badge>
                </div>

                {cert.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cert.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified Issuer</span>
                  </span>
                  <span>Issued on {new Date(cert.issued_on).toLocaleDateString()}</span>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-muted/30 border-t border-border/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground" title="QR Token">
                  <QrCode className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">{cert.qr_token}</span>
                </div>

                <div className="flex items-center gap-2">
                  {cert.pdf_media_url && (
                    <a
                      href={cert.pdf_media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs gap-1")}
                    >
                      <FileText className="h-3 w-3" />
                      <span>PDF</span>
                    </a>
                  )}
                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "h-7 text-xs gap-1")}
                    >
                      <span>Verify</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

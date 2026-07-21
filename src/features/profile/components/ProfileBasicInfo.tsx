import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Calendar, Heart } from "lucide-react";

export interface ProfileBasicInfoProps {
  bio?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt?: string | null;
  className?: string;
}

export function ProfileBasicInfo({
  bio,
  gender,
  dateOfBirth,
  email,
  phone,
  createdAt,
  className,
}: ProfileBasicInfoProps) {
  const hasContactInfo = Boolean(email || phone || dateOfBirth || gender);

  return (
    <Card className={cn("overflow-hidden heritage-card-glass", className)}>
      <CardHeader className="pb-3 border-b border-white/10 bg-white/5">
        <CardTitle className="text-base font-semibold flex items-center gap-2 heritage-card-title">
          <User className="h-4 w-4 heritage-icon" />
          <span>About & Identity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider heritage-card-muted mb-2">
            Biography
          </h4>
          <p className="text-sm leading-relaxed heritage-card-title whitespace-pre-wrap">
            {bio && bio.trim() ? bio : <span className="heritage-card-muted italic">No biography provided yet.</span>}
          </p>
        </div>

        {hasContactInfo && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider heritage-card-muted mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] heritage-card-muted font-medium">Email</div>
                    <div className="font-medium heritage-card-title truncate">{email}</div>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] heritage-card-muted font-medium">Phone</div>
                    <div className="font-medium heritage-card-title truncate">{phone}</div>
                  </div>
                </div>
              )}

              {dateOfBirth && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] heritage-card-muted font-medium">Date of Birth</div>
                    <div className="font-medium heritage-card-title">{dateOfBirth}</div>
                  </div>
                </div>
              )}

              {gender && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 heritage-icon shrink-0">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] heritage-card-muted font-medium">Gender</div>
                    <div className="font-medium heritage-card-title capitalize">{gender.replace(/_/g, " ")}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {createdAt && (
          <div className="pt-3 border-t border-white/10 text-xs heritage-card-muted flex items-center justify-between">
            <span>Member since</span>
            <span className="font-medium heritage-card-title">
              {new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

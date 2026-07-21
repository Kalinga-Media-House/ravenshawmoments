"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  submitVerificationRequest,
  getMyVerificationStatus,
} from "@/actions/student/verification.actions";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface VerificationEntry {
  id: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  resolved_at?: string;
  rejection_reason?: string;
  submitted_data?: Record<string, any>;
}

interface Props {
  profileId: string;
  isVerified: boolean;
  verificationHistory: VerificationEntry[];
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/20",
  },
};

export function VerificationPageClient({
  profileId,
  isVerified,
  verificationHistory,
}: Props) {
  const [history, setHistory] = useState<VerificationEntry[]>(verificationHistory);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const latestRequest = history[0];
  const hasPendingRequest = latestRequest?.status === "pending";
  const canSubmit = !isVerified && !hasPendingRequest;

  const handleSubmit = () => {
    if (!rollNumber.trim()) {
      toast.error("Roll number is required");
      return;
    }

    startTransition(async () => {
      const payload = {
        rollNumber: rollNumber.trim(),
        registrationNumber: registrationNumber.trim(),
        additionalNotes: additionalNotes.trim(),
      };

      const result = await submitVerificationRequest(payload);
      if (result.success) {
        // @ts-ignore
        setHistory((prev) => [result.data, ...prev]);
        toast.success("Verification request submitted");
        setShowSubmitForm(false);
        setRollNumber("");
        setRegistrationNumber("");
        setAdditionalNotes("");
      } else {
        toast.error(result.error || "Failed to submit");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your student identity to unlock full platform features
        </p>
      </div>

      {/* Current Status */}
      {isVerified ? (
        <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <ShieldCheck size={24} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald-500">Verified Student</h2>
              <p className="text-sm text-muted-foreground">
                Your identity has been verified. You have access to all platform features.
              </p>
            </div>
          </div>
        </div>
      ) : hasPendingRequest ? (
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
              <Clock size={24} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-500">Verification Pending</h2>
              <p className="text-sm text-muted-foreground">
                Your verification request is under review. You will be notified once processed.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted{" "}
                {new Date(latestRequest.submitted_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted/20">
              <AlertTriangle size={24} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Not Verified</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Submit a verification request to unlock features like profile badges, gallery
                uploads, and competition entries.
              </p>
              <button
                onClick={() => setShowSubmitForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <FileText size={16} />
                Submit Verification Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Form */}
      {showSubmitForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">Verification Request</h2>
          <p className="text-sm text-muted-foreground">
            Provide your student details so your department CR or admin can verify your identity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Roll Number *</label>
              <input
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="e.g. 21CS001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Registration Number
              </label>
              <input
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="e.g. RU-2021-12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              placeholder="Any additional information for the reviewer..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Submit Request
            </button>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Verification Timeline */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Verification History
          </h2>
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

            {history.map((entry, idx) => {
              const config = statusConfig[entry.status];
              const StatusIcon = config.icon;

              return (
                <div key={entry.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  <div
                    className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${config.bgColor}`}
                  >
                    <StatusIcon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.submitted_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {entry.status === "rejected" && entry.rejection_reason && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Reason: {entry.rejection_reason}
                      </p>
                    )}
                    {entry.resolved_at && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Resolved{" "}
                        {new Date(entry.resolved_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

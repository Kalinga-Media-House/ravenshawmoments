"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { claimStudentProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { ShieldAlert, Loader2, GraduationCap, CheckCircle } from "lucide-react";

export interface ClaimProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultRollNumber?: string;
}

export function ClaimProfileDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultRollNumber = "",
}: ClaimProfileDialogProps) {
  const [rollNumber, setRollNumber] = React.useState(defaultRollNumber);
  const [regNumber, setRegNumber] = React.useState("");
  const [docUrl, setDocUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      toast.error("University Roll Number is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("roll_number", rollNumber.trim());
      formData.append("registration_number", regNumber.trim());
      formData.append("supporting_document_url", docUrl.trim());

      const res = await claimStudentProfile(formData);
      if (res.success) {
        toast.success("Profile claim request submitted successfully! Under verification.");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error?.message || "Failed to submit claim request.");
      }
    } catch {
      toast.error("Network error while submitting claim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />
            <span>Claim Student Roll Number</span>
          </DialogTitle>
          <DialogDescription>
            Verify your identity as a Ravenshaw student to unlock verified badges and academic records.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2.5">
            <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
            <span>
              Your roll number will be checked against institutional records. Once verified, no other account can claim this identifier.
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim-roll">University Roll Number *</Label>
            <Input
              id="claim-roll"
              placeholder="e.g. 21DCA045 or 22ENG012"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={isSubmitting}
              required
              className="font-mono uppercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim-reg">Registration Number (Optional)</Label>
            <Input
              id="claim-reg"
              placeholder="e.g. 21098452"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              disabled={isSubmitting}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim-doc">Supporting ID Card URL (Optional)</Label>
            <Input
              id="claim-doc"
              type="url"
              placeholder="https://cloud.storage/student-id.jpg"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              disabled={isSubmitting}
            />
            <span className="text-[11px] text-muted-foreground block">
              Provide a secure link to your student ID card or fee receipt to expedite verification.
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!rollNumber.trim() || isSubmitting} className="gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{isSubmitting ? "Submitting..." : "Submit Claim Request"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

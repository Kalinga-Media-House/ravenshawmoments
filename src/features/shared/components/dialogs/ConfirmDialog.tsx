// =============================================================================
// Ravenshaw Moments - Enterprise Dialog Helpers
// File: src/features/shared/components/dialogs/ConfirmDialog.tsx
// =============================================================================

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Trash2, HelpCircle } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "confirm" | "delete" | "warning" | "success";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "confirm",
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  const loading = isLoading || isPending;

  const config = {
    confirm: {
      icon: HelpCircle,
      iconColor: "text-primary bg-primary/10",
      btnVariant: "primary" as const,
      defaultLabel: "Confirm",
    },
    delete: {
      icon: Trash2,
      iconColor: "text-destructive bg-destructive/10",
      btnVariant: "destructive" as const,
      defaultLabel: "Delete",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-600 bg-amber-500/10",
      btnVariant: "outline" as const,
      defaultLabel: "Proceed",
    },
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-500/10",
      btnVariant: "primary" as const,
      defaultLabel: "Continue",
    },
  }[variant];

  const IconComponent = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!loading} className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-start gap-4">
          <div className={`size-11 rounded-2xl shrink-0 flex items-center justify-center ${config.iconColor}`}>
            <IconComponent className="size-5" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={config.btnVariant}
            onClick={handleConfirm}
            isLoading={loading}
          >
            {confirmLabel || config.defaultLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog(props: Omit<ConfirmDialogProps, "variant">) {
  return <ConfirmDialog {...props} variant="delete" confirmLabel={props.confirmLabel || "Delete Permanently"} />;
}

export function SuccessDialog(props: Omit<ConfirmDialogProps, "variant">) {
  return <ConfirmDialog {...props} variant="success" confirmLabel={props.confirmLabel || "Okay"} />;
}

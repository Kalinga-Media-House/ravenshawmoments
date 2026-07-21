'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onDelete: () => void;
  loading?: boolean;
  title?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  itemName,
  onDelete,
  loading = false,
  title = 'Delete Confirmation',
}: DeleteDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isMatch = confirmText === itemName;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle className="text-red-500">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-[#8B7078] pt-2">
            This action cannot be undone. This will permanently delete{' '}
            <strong className="text-[#F5E6EA] font-semibold">{itemName}</strong> and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-[#8B7078]">
              Please type <strong className="text-[#F5E6EA]">{itemName}</strong> to confirm.
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              className="bg-[#0F0A0B] border-[#2D1F23] text-[#F5E6EA]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
            className="border-[#2D1F23] text-[#F5E6EA] hover:bg-[#2D1F23]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            disabled={!isMatch || loading}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

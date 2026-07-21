'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, FileText, BarChart2, Smile } from 'lucide-react';
import { createPostAction } from '../actions/community.actions';
import { ProfileVerificationDialog } from '@/components/profile/ProfileVerificationDialog';
import { canCreatePublicContent } from '@/lib/utils/permissions';
import { toast } from 'sonner';

export function CreatePostComposer({ currentUser }: { currentUser: any }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (currentUser && !canCreatePublicContent(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    if (!content.trim()) return;
    setIsLoading(true);
    const res = await createPostAction({ content });
    setIsLoading(false);
    if (res.success) {
      setContent('');
      toast.success('Post published to the community feed!');
    } else {
      if (typeof res.error === 'string' && res.error.toLowerCase().includes('verification required')) {
        setVerificationDialogOpen(true);
      } else {
        toast.error(res.error || 'Failed to publish post');
      }
    }
  };

  const handleFocus = () => {
    if (currentUser && !canCreatePublicContent(currentUser)) {
      setVerificationDialogOpen(true);
    }
  };

  return (
    <>
      <ProfileVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        status={currentUser?.profile_status || (currentUser?.is_verified ? 'verified' : 'pending')}
        actionName="create public community posts"
      />
      <Card className="p-5 sm:p-6 mb-6 rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200">
        <div className="flex items-start gap-4">
          <Avatar className="size-11 rounded-full border border-border/60 shadow-xs shrink-0">
            <AvatarImage src={currentUser?.avatar_url} alt={currentUser?.full_name || 'User avatar'} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-[#2A0810] to-[#4A0E1B] text-[#D4AF37] font-bold text-sm select-none">
              {currentUser?.full_name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-3">
            <Textarea
              placeholder="Share an update, announcement, or campus moment..."
              className="w-full border-none focus-visible:ring-0 px-0 resize-none min-h-[90px] text-base sm:text-lg bg-transparent text-foreground placeholder:text-muted-foreground shadow-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
            />
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleFocus}
                  className="rounded-xl hover:text-primary hover:bg-primary/10"
                  title="Add Image"
                >
                  <ImageIcon className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleFocus}
                  className="rounded-xl hover:text-primary hover:bg-primary/10"
                  title="Attach Document"
                >
                  <FileText className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleFocus}
                  className="rounded-xl hover:text-primary hover:bg-primary/10 hidden sm:inline-flex"
                  title="Create Poll"
                >
                  <BarChart2 className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleFocus}
                  className="rounded-xl hover:text-primary hover:bg-primary/10 hidden sm:inline-flex"
                  title="Emoji"
                >
                  <Smile className="size-5" />
                </Button>
              </div>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading || !content.trim()}
                isLoading={isLoading}
                className="rounded-full px-6 font-semibold shadow-xs"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

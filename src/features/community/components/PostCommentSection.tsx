"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addCommentAction } from "../actions/community.actions";
import { ProfileVerificationDialog } from "@/components/profile/ProfileVerificationDialog";
import { canCreatePublicContent } from "@/lib/utils/permissions";
import { toast } from "sonner";

export function PostCommentSection({
  postId,
  initialComments = [],
  currentUser,
}: {
  postId: string;
  initialComments: any[];
  currentUser: any;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (currentUser && !canCreatePublicContent(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    if (!content.trim()) return;
    setIsLoading(true);
    const res = await addCommentAction({ post_id: postId, content });
    setIsLoading(false);

    if (res.success) {
      setContent("");
      const newComment = {
        id: "temp-" + Date.now(),
        content,
        created_at: new Date().toISOString(),
        author: {
          id: currentUser?.id,
          full_name: currentUser?.full_name || "You",
          avatar_url: currentUser?.avatar_url,
        },
      };
      setComments([...comments, newComment]);
      toast.success("Comment added successfully!");
    } else {
      if (typeof res.error === "string" && res.error.toLowerCase().includes("verification required")) {
        setVerificationDialogOpen(true);
      } else {
        toast.error(res.error || "Failed to add comment");
      }
    }
  };

  const handleFocus = () => {
    if (currentUser && !canCreatePublicContent(currentUser)) {
      setVerificationDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        status={currentUser?.profile_status || (currentUser?.is_verified ? "verified" : "pending")}
        actionName="comment on public posts"
      />

      {currentUser ? (
        <div className="flex items-start gap-3 mb-6 bg-muted/40 p-4 rounded-2xl border border-border/80">
          <Avatar className="size-9 rounded-full border border-border/60 shrink-0">
            <AvatarImage src={currentUser?.avatar_url} alt={currentUser?.full_name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-[#2A0810] to-[#4A0E1B] text-[#D4AF37] font-bold text-xs select-none">
              {currentUser?.full_name?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a thoughtful comment..."
              className="w-full bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-primary min-h-[70px] text-sm resize-none rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={isLoading || !content.trim()}
                isLoading={isLoading}
                className="rounded-full px-5 text-xs font-semibold"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 bg-muted/30 rounded-2xl border border-dashed border-border/80 mb-6 text-sm text-muted-foreground">
          Please sign in to join the conversation and leave a comment.
        </div>
      )}

      <div className="space-y-3.5">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="size-8 rounded-full border border-border/60 shrink-0">
                <AvatarImage src={comment.author?.avatar_url} alt={comment.author?.full_name || "User"} />
                <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                  {comment.author?.full_name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/30 rounded-2xl p-3.5 border border-border/60 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {comment.author?.full_name || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border/60 rounded-2xl bg-muted/10">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}

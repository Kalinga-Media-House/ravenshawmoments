'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Share2, MoreHorizontal, Bookmark, ShieldAlert, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toggleReactionAction, reportContentAction, updatePostAction, deletePostAction } from '@/features/community/actions/community.actions';
import { toast } from 'sonner';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommunityPost({ post, currentUser }: { post: any, currentUser?: any }) {
  const authorName = post.author?.full_name || 'Anonymous';
  const authorAvatar = post.author?.avatar_url || '';
  const hasActiveId = post.author?.digital_identities?.some((id: any) => id.status === 'active');
  const dateStr = new Date(post.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const [isPending, startTransition] = useTransition();
  const [reactionCount, setReactionCount] = useState(post.reactions?.[0]?.count || 0);
  const [hasReacted, setHasReacted] = useState(false); // In a real app, initialize from post data

  const handleReaction = () => {
    startTransition(async () => {
      const result = await toggleReactionAction(post.id, 'LIKE');
      if (result.success) {
        setHasReacted(!hasReacted);
        setReactionCount((prev: number) => hasReacted ? prev - 1 : prev + 1);
      } else {
        toast.error(result.error || 'Failed to react');
      }
    });
  };

  const handleReport = () => {
    const reason = window.prompt("Reason for reporting:");
    if (!reason) return;
    
    startTransition(async () => {
      const result = await reportContentAction({
        entity_type: 'post',
        entity_id: post.id,
        reason: reason
      });
      if (result.success) {
        toast.success("Post reported successfully. Our moderators will review it.");
      } else {
        toast.error(result.error || 'Failed to report post');
      }
    });
  };

  return (
    <Card className="p-5 sm:p-6 mb-5 rounded-2xl border border-border/80 bg-card hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          <Avatar className="size-11 rounded-full border border-border/60 shadow-xs shrink-0">
            <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-[#2A0810] to-[#4A0E1B] text-[#D4AF37] font-bold text-sm select-none">
              {authorName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
                {authorName}
              </span>
              {hasActiveId && (
                <span
                  className="inline-flex items-center justify-center text-[#D4AF37] shrink-0"
                  title="Verified Digital ID"
                >
                  <CheckCircle2 className="size-4 fill-current text-[#D4AF37] stroke-[#8F0028]" />
                </span>
              )}
              {post.actor_entity_type && (
                <span className="text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border/60 uppercase tracking-wider flex items-center shrink-0">
                  {post.actor_entity_type === 'department' ? '🏛️ Dept' :
                   post.actor_entity_type === 'business' ? '💼 Sponsor' : 
                   post.actor_entity_type}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>{dateStr}</span>
              {post.is_sponsored && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Zap className="size-3 fill-primary text-primary" />
                    <span>Sponsored</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-0 border-none bg-transparent hover:bg-transparent">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground">
              <MoreHorizontal className="size-5" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(currentUser?.id === post.author_profile_id) && (
              <>
                <DropdownMenuItem onClick={() => {
                  const newContent = window.prompt("Edit your post:", post.content);
                  if (newContent && newContent !== post.content) {
                    startTransition(async () => {
                      const result = await updatePostAction(post.id, newContent);
                      if (result.success) {
                        toast.success("Post updated successfully");
                      } else {
                        toast.error(result.error || "Failed to update post");
                      }
                    });
                  }
                }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this post?")) {
                      startTransition(async () => {
                        const result = await deletePostAction(post.id);
                        if (result.success) {
                          toast.success("Post deleted successfully");
                        } else {
                          toast.error(result.error || "Failed to delete post");
                        }
                      });
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleReport}>
              <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
              <span>Report Issue</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm sm:text-base leading-relaxed text-foreground mb-4 whitespace-pre-wrap break-words">
        {post.content}
      </div>

      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border/60 bg-muted/20">
          {post.media.map((m: any, idx: number) => (
            m.media?.url && (
              <img
                key={idx}
                src={m.media.url}
                alt="Post media"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            )
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3.5 border-t border-border/60 text-muted-foreground">
        <div className="flex items-center gap-1 sm:gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("gap-1.5 rounded-xl hover:text-rose-600 hover:bg-rose-500/10", hasReacted && "text-rose-600")}
            onClick={handleReaction}
            disabled={isPending}
          >
            <Heart className={cn("size-4", hasReacted && "fill-current")} />
            <span className="text-xs sm:text-sm font-medium">{reactionCount}</span>
          </Button>
          <Link
            href={`/community/post/${post.slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-9 px-3"
          >
            <MessageSquare className="size-4" />
            <span>{post.comments?.[0]?.count || 0}</span>
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl hover:text-primary hover:bg-primary/10">
            <Share2 className="size-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Share</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="rounded-xl hover:text-amber-500 hover:bg-amber-500/10" title="Save post">
            <Bookmark className="size-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="rounded-xl hover:text-destructive hover:bg-destructive/10" 
            title="Report"
            onClick={handleReport}
            disabled={isPending}
          >
            <ShieldAlert className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

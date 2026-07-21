import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ user, className }: { user: { full_name?: string | null; avatar_url?: string | null }; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ""} />
      <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
    </Avatar>
  );
}

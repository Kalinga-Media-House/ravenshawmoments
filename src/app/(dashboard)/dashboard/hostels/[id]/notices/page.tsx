import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HostelNoticeRepository } from "@/repositories/hostel/hostelNotice.repository";
import { NoticeClient } from "./NoticeClient";
import Link from "next/link";
import { ChevronRight, Megaphone } from "lucide-react";

export default async function NoticesPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  const { data: hostel } = await (supabase as any).from("hostels").select("*").eq("id", params.id).single();
  if (!hostel) return <div>Hostel not found.</div>;

  const repo = new HostelNoticeRepository({ supabase: supabase as any });
  const notices = await repo.getNoticesByHostelId(hostel.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/hostels/${hostel.id}`} className="hover:text-foreground">{hostel.name} Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Notice Board</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Megaphone className="w-6 h-6 mr-3 text-indigo-500" /> Notice Board
        </h1>
      </div>

      <NoticeClient hostelId={hostel.id} initialNotices={notices} />
    </div>
  );
}

import { requireAuth } from "@/auth/guards/require-auth";
import { getDepartment } from "@/actions/department/department.actions";
import { getDashboardData } from "@/actions/department/dashboard.actions";
import {
  Users,
  GraduationCap,
  BookOpen,
  Image,
  Trophy,
  ShieldCheck,
  TrendingUp,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { slug: string };
}

export default async function DashboardPage({ params }: PageProps) {
  await requireAuth();
  const deptResult = await getDepartment(params.slug);

  if (!deptResult.success) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#8B7078]">Failed to load department data.</p>
      </div>
    );
  }

  const dept = deptResult.data;

  const stats = [
    {
      title: "Faculty",
      value: dept.faculty_count ?? 0,
      description: "Active members",
      icon: <Users size={20} />,
      href: `/department/${params.slug}/faculty`,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-400",
    },
    {
      title: "Students",
      value: dept.students_count ?? 0,
      description: "Enrolled",
      icon: <GraduationCap size={20} />,
      href: `/department/${params.slug}/students`,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-400",
    },
    {
      title: "Programs",
      value: dept.programs_count ?? 0,
      description: "Offered",
      icon: <BookOpen size={20} />,
      href: `/department/${params.slug}/programs`,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-400",
    },
    {
      title: "Gallery",
      value: dept.gallery_count ?? 0,
      description: "Albums",
      icon: <Image size={20} />,
      href: `/department/${params.slug}/gallery`,
      gradient: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-400",
    },
    {
      title: "Achievements",
      value: dept.achievement_count ?? 0,
      description: "Published",
      icon: <Trophy size={20} />,
      href: `/department/${params.slug}/achievements`,
      gradient: "from-[#7C2D3E]/20 to-[#9B3A4D]/10",
      iconColor: "text-[#9B3A4D]",
    },
    {
      title: "Pending",
      value: dept.pending_verifications ?? 0,
      description: "Verifications",
      icon: <ShieldCheck size={20} />,
      href: `/department/${params.slug}/verification`,
      gradient: "from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-400",
    },
  ];

  const quickActions = [
    { label: "Add Faculty", href: `/department/${params.slug}/faculty?action=create`, icon: Users },
    { label: "Upload Media", href: `/department/${params.slug}/media?action=upload`, icon: Image },
    { label: "New Content", href: `/department/${params.slug}/content?action=create`, icon: FileText },
    { label: "Add Achievement", href: `/department/${params.slug}/achievements?action=create`, icon: Trophy },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#F5E6EA]">Dashboard</h1>
        <p className="text-sm text-[#8B7078] mt-1">
          Overview of {dept.name} department
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className={`group relative overflow-hidden rounded-xl border border-[#2D1F23] bg-gradient-to-br ${stat.gradient} bg-[#1A1214] p-6 transition-all duration-300 hover:border-[#9B3A4D]/30 hover:shadow-lg hover:shadow-[#7C2D3E]/5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B7078]">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-[#F5E6EA]">{stat.value}</p>
                <p className="mt-1 text-xs text-[#8B7078]">{stat.description}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F0A0B]/50 ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#7C2D3E] to-[#9B3A4D] transition-all duration-500 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6">
        <h2 className="text-lg font-semibold text-[#F5E6EA] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-[#2D1F23] bg-[#0F0A0B] p-4 text-[#8B7078] transition-all duration-200 hover:border-[#9B3A4D]/30 hover:text-[#F5E6EA] hover:bg-[#2D1F23]/30"
            >
              <action.icon size={24} />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6">
          <h2 className="text-lg font-semibold text-[#F5E6EA] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { text: "New faculty member added", time: "2 hours ago", icon: Users },
              { text: "Gallery album published", time: "5 hours ago", icon: Image },
              { text: "Content section updated", time: "1 day ago", icon: FileText },
              { text: "Student verification approved", time: "2 days ago", icon: ShieldCheck },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#2D1F23]">
                  <activity.icon size={14} className="text-[#9B3A4D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F5E6EA]">{activity.text}</p>
                  <p className="text-xs text-[#8B7078] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Status */}
        <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6">
          <h2 className="text-lg font-semibold text-[#F5E6EA] mb-4">Department Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B7078]">Status</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  dept.is_active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {dept.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B7078]">Established</span>
              <span className="text-sm text-[#F5E6EA]">{dept.established_year || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B7078]">Slug</span>
              <span className="text-sm text-[#F5E6EA] font-mono">/{params.slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B7078]">Last Updated</span>
              <span className="text-sm text-[#F5E6EA]">
                {dept.updated_at
                  ? new Date(dept.updated_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

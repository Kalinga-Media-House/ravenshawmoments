import { requireAuth } from "@/auth/guards/require-auth";
import { getDepartment } from "@/actions/department/department.actions";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { DepartmentAdminProvider } from "./context";
import { DepartmentSidebar } from "./sidebar";
import { DepartmentTopbar } from "./topbar";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DepartmentAdminLayout({ children, params }: LayoutProps) {
  const user = await requireAuth();
  const { slug } = await params;
  const result = await getDepartment(slug);

  if (!result.success) {
    redirect("/dashboard");
  }

  const dept = result.data;

  const contextValue = {
    departmentId: dept.id,
    slug: slug,
    name: dept.name,

    permissions: dept.userPermissions || [],
  };

  return (
    <DepartmentAdminProvider value={contextValue}>
      <div className="flex min-h-screen bg-[#0F0A0B]">
        <DepartmentSidebar slug={slug} departmentName={dept.name} />
        <div className="flex flex-1 flex-col">
          <DepartmentTopbar
            departmentName={dept.name}
            userEmail={user.email || ""}
            slug={slug}
          />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C2D3E] border-t-transparent" />
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </DepartmentAdminProvider>
  );
}

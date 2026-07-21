import { requireAuth } from "@/auth/guards/require-auth";
import { getDepartment } from "@/actions/department/department.actions";

export default async function DashboardPage({ searchParams }: { searchParams: { slug?: string } }) {
  await requireAuth();
  
  // Hardcoded for demo purposes; normally derived from session or route params
  const slug = searchParams.slug || "computer-science";
  const result = await getDepartment(slug);
  
  if (!result.success) {
    return <div>Error loading dashboard data: {result.error}</div>;
  }

  const dept = result.data;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Faculty</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{dept?.faculty_count || 0}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Students</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{dept?.students_count || 0}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Programs Offered</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{dept?.programs_count || 0}</div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Overview</h3>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-muted-foreground">Department: {dept?.name}</p>
            <p className="text-sm text-muted-foreground">Status: {dept?.is_active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


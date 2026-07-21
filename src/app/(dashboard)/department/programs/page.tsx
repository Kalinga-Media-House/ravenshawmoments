import { requireAuth } from "@/auth/guards/require-auth";
// Note: In real app, fetch from program.actions.ts
// import { listPrograms } from "@/actions/department/program.actions";

export default async function ProgramsPage() {
  await requireAuth();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Programs</h2>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2">
          Add Program
        </button>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration (Years)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">B.Sc Computer Science</td>
                  <td className="p-4 align-middle">Undergraduate</td>
                  <td className="p-4 align-middle">3</td>
                  <td className="p-4 align-middle">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


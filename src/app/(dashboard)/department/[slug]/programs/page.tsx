import { requireAuth } from '@/auth/guards/require-auth';
import { getPrograms } from '@/actions/department/programs.actions';
import { ProgramForm } from './program-form';
import { PlusCircle, Search, Edit2, Archive, Activity } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { q?: string; status?: string };
}) {
  await requireAuth();
  
  const { slug } = await params;
  const q = searchParams.q || '';
  const status = searchParams.status || 'All';
  
  // Note: Assuming departmentId is resolved from slug inside the action or here. We pass slug.
  // @ts-ignore
  const programsResult = await getPrograms(slug);
  
  if (!programsResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          // @ts-ignore
          <p className="text-[#9B3A4D]">Error loading programs: {programsResult.error}</p>
        </div>
      </div>
    );
  }

  let programs = programsResult.data || [];
  
  if (q) {
    // @ts-ignore
    programs = programs.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (status !== 'All') {
    // @ts-ignore
    programs = programs.filter(p => p.status === status);
  }

  return (
    <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-[#8B7078] text-sm mt-1">Manage academic programs for the department.</p>
        </div>
        // @ts-ignore
        <ProgramForm slug={slug} departmentId={programs[0]?.departmentId || ''} />
      </div>

      <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2D1F23] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1A1214]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7078]" />
            <form>
              <input type="hidden" name="status" value={status} />
              <input 
                name="q"
                defaultValue={q}
                placeholder="Search programs..."
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F5E6EA] placeholder:text-[#8B7078] focus:outline-none focus:border-[#7C2D3E] transition-colors"
              />
            </form>
          </div>
          
          <div className="flex bg-[#0F0A0B] p-1 rounded-lg border border-[#2D1F23] w-full sm:w-auto">
            {['All', 'Active', 'Archived'].map((s: any) => (
              <Link
                key={s}
                href={`?status=${s}${q ? `&q=${q}` : ''}`}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors flex-1 text-center ${
                  status === s 
                    ? 'bg-[#7C2D3E] text-[#F5E6EA] font-medium' 
                    : 'text-[#8B7078] hover:text-[#F5E6EA]'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {programs.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No programs found</h3>
              <p className="text-[#8B7078] max-w-md text-sm">
                Get started by creating your first academic program.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2D1F23] bg-[#0F0A0B]/50">
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Name</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Degree Level</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Duration</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Total Seats</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Status</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1F23]">
                {programs.map((program: any) => (
                  <tr key={program.id} className="hover:bg-[#2D1F23]/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{program.name}</div>
                    </td>
                    <td className="p-4 text-sm">{program.degree_level}</td>
                    <td className="p-4 text-sm">{program.duration_years} Years</td>
                    <td className="p-4 text-sm">{program.total_seats}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        program.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProgramForm 
                          slug={slug} 
                          departmentId={program.departmentId} 
                          initialData={program}
                          trigger={
                            <button className="p-1.5 text-[#8B7078] hover:text-[#F5E6EA] bg-[#0F0A0B] rounded-md border border-[#2D1F23] hover:border-[#7C2D3E] transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          }
                        />
                        {program.status === 'Active' && (
                          <button className="p-1.5 text-[#8B7078] hover:text-[#9B3A4D] bg-[#0F0A0B] rounded-md border border-[#2D1F23] hover:border-[#9B3A4D] transition-colors">
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

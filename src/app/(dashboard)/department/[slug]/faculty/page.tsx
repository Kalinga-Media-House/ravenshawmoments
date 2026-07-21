import { requireAuth } from '@/auth/guards/require-auth';
import { getFaculty } from '@/actions/department/faculty.actions';
import { FacultyForm } from './faculty-form';
import { FacultyCard } from './faculty-card';
import { Search, Users } from 'lucide-react';

export default async function FacultyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { q?: string; designation?: string };
}) {
  await requireAuth();
  
  const { slug } = await params;
  const q = searchParams.q || '';
  const designation = searchParams.designation || '';
  
  // @ts-ignore
  const facultyResult = await getFaculty(slug);
  
  if (!facultyResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          // @ts-ignore
          <p className="text-[#9B3A4D]">Error loading faculty: {facultyResult.error}</p>
        </div>
      </div>
    );
  }

  let faculty = facultyResult.data || [];
  
  if (q) {
    // @ts-ignore
    faculty = faculty.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (designation) {
    // @ts-ignore
    faculty = faculty.filter(f => f.designation === designation);
  }

  // Extract unique designations for filter
  // @ts-ignore
  const designations = Array.from(new Set(facultyResult.data?.map(f => f.designation) || [])).filter(Boolean);

  return (
    <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Directory</h1>
          <p className="text-[#8B7078] text-sm mt-1">Manage teaching staff and researchers.</p>
        </div>
        <FacultyForm slug={slug} />
      </div>

      <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7078]" />
          <form>
            <input type="hidden" name="designation" value={designation} />
            <input 
              name="q"
              defaultValue={q}
              placeholder="Search faculty..."
              className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F5E6EA] placeholder:text-[#8B7078] focus:outline-none focus:border-[#7C2D3E] transition-colors"
            />
          </form>
        </div>
        
        <form className="w-full sm:w-auto">
          <input type="hidden" name="q" value={q} />
          <select 
            name="designation"
            defaultValue={designation}
            onChange={(e) => e.target.form?.submit()}
            className="w-full sm:w-48 bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors appearance-none"
          >
            <option value="">All Designations</option>
            {designations.map(d => (
              <option key={d as string} value={d as string}>{d as string}</option>
            ))}
          </select>
        </form>
      </div>

      {faculty.length === 0 ? (
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No faculty found</h3>
          <p className="text-[#8B7078] max-w-md text-sm">
            No faculty members match your criteria or none have been added yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {faculty.map((member: any) => (
            <FacultyCard key={member.id} member={member} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
}

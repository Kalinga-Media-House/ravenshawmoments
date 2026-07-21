import { requireAuth } from '@/auth/guards/require-auth';
import { getStudents } from '@/actions/department/students.actions';
import { StudentActionsCell } from './student-actions-cell';
import { Search, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default async function StudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { q?: string; status?: string };
}) {
  await requireAuth();
  
  const { slug } = await params;
  const q = searchParams.q || '';
  const status = searchParams.status || 'Verified';
  
  // @ts-ignore
  const studentsResult = await getStudents(slug);
  
  if (!studentsResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          // @ts-ignore
          <p className="text-[#9B3A4D]">Error loading students: {studentsResult.error}</p>
        </div>
      </div>
    );
  }

  let students = studentsResult.data || [];
  
  if (q) {
    students = students.filter(s => 
      // @ts-ignore
      s.name.toLowerCase().includes(q.toLowerCase()) || 
      // @ts-ignore
      s.roll_no?.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  // @ts-ignore
  students = students.filter(s => s.status === status);

  return (
    <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-[#8B7078] text-sm mt-1">Manage department students and verification requests.</p>
      </div>

      <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2D1F23] flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1A1214]">
          <div className="flex bg-[#0F0A0B] p-1 rounded-lg border border-[#2D1F23] w-full md:w-auto">
            {['Verified', 'Pending', 'Rejected'].map((s: any) => (
              <Link
                key={s}
                href={`?status=${s}${q ? `&q=${q}` : ''}`}
                className={`px-6 py-2 text-sm rounded-md transition-colors flex-1 text-center ${
                  status === s 
                    ? 'bg-[#7C2D3E] text-[#F5E6EA] font-medium' 
                    : 'text-[#8B7078] hover:text-[#F5E6EA]'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>

          <div className="relative w-full md:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7078]" />
            <form>
              <input type="hidden" name="status" value={status} />
              <input 
                name="q"
                defaultValue={q}
                placeholder="Search by name or roll no..."
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F5E6EA] placeholder:text-[#8B7078] focus:outline-none focus:border-[#7C2D3E] transition-colors"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          {students.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No students found</h3>
              <p className="text-[#8B7078] max-w-md text-sm">
                No students in the "{status}" category.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2D1F23] bg-[#0F0A0B]/50">
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Name</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Roll No</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Program</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Batch</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078]">Status</th>
                  <th className="p-4 text-sm font-medium text-[#8B7078] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1F23]">
                {students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-[#2D1F23]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2D1F23] flex items-center justify-center text-xs font-medium text-[#F5E6EA]">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-[#8B7078]">{student.roll_no || '-'}</td>
                    <td className="p-4 text-sm">{student.program_name || '-'}</td>
                    <td className="p-4 text-sm">{student.batch_year || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        student.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        student.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <StudentActionsCell 
                        studentId={student.id} 
                        status={student.status} 
                        departmentId={student.departmentId}
                        slug={slug}
                      />
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

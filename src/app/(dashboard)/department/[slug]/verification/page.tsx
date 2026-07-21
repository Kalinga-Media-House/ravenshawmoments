import { requireAuth } from '@/auth/guards/require-auth';
import { Check, X, Eye } from 'lucide-react';
import { RejectDialog } from './reject-dialog';

export default async function VerificationPage({ params }: { params: { slug: string } }) {
  await requireAuth();

  const verifications = [
    { id: '1', student: 'Alice Johnson', date: '2024-07-18', docs: 2, status: 'Pending' },
    { id: '2', student: 'Bob Smith', date: '2024-07-17', docs: 1, status: 'Approved' },
  ];

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Verification Queue</h1>
        
        <div className="flex gap-4 border-b border-[#2D1F23]">
          <button className="pb-3 px-4 border-b-2 border-[#7C2D3E] text-[#F5E6EA] font-medium">Pending</button>
          <button className="pb-3 px-4 text-[#8B7078] hover:text-[#F5E6EA] transition-colors">Approved</button>
          <button className="pb-3 px-4 text-[#8B7078] hover:text-[#F5E6EA] transition-colors">Rejected</button>
        </div>
      </div>

      <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2D1F23] text-[#8B7078] text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Student Name</th>
              <th className="px-6 py-4 font-medium">Submitted Date</th>
              <th className="px-6 py-4 font-medium">Documents</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D1F23]">
            {verifications.map((item) => (
              <tr key={item.id} className="hover:bg-[#2D1F23]/30 transition-colors">
                <td className="px-6 py-4 font-medium">{item.student}</td>
                <td className="px-6 py-4 text-[#8B7078] text-sm">{item.date}</td>
                <td className="px-6 py-4 text-[#8B7078] text-sm">{item.docs} files</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' :
                    item.status === 'Approved' ? 'bg-green-900/30 text-green-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-2 bg-[#2D1F23] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="View Documents">
                    <Eye size={18} />
                  </button>
                  {item.status === 'Pending' && (
                    <>
                      <button className="p-2 bg-green-900/30 rounded text-green-400 hover:bg-green-900/60" title="Approve">
                        <Check size={18} />
                      </button>
                      <RejectDialog verificationId={item.id} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {verifications.length === 0 && (
          <div className="p-12 text-center text-[#8B7078]">
            No verification requests found.
          </div>
        )}
      </div>
    </div>
  );
}

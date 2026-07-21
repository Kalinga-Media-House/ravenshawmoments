import { requireAuth } from '@/auth/guards/require-auth';
import { Users, Eye, Database, Search } from 'lucide-react';

export default async function AnalyticsPage({ params }: { params: { slug: string } }) {
  await requireAuth();

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <h1 className="text-2xl font-bold mb-8">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8B7078] font-medium">Total Views</h3>
            <Eye className="text-[#9B3A4D]" size={20} />
          </div>
          <p className="text-3xl font-bold">12,450</p>
          <p className="text-xs text-green-400 mt-2">+14% from last month</p>
        </div>
        
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8B7078] font-medium">Total Visitors</h3>
            <Users className="text-[#9B3A4D]" size={20} />
          </div>
          <p className="text-3xl font-bold">3,820</p>
          <p className="text-xs text-green-400 mt-2">+5% from last month</p>
        </div>
        
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8B7078] font-medium">Media Storage</h3>
            <Database className="text-[#9B3A4D]" size={20} />
          </div>
          <p className="text-3xl font-bold">4.2 GB</p>
          <p className="text-xs text-[#8B7078] mt-2">of 10 GB limit</p>
        </div>
        
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8B7078] font-medium">Search Queries</h3>
            <Search className="text-[#9B3A4D]" size={20} />
          </div>
          <p className="text-3xl font-bold">1,204</p>
          <p className="text-xs text-red-400 mt-2">-2% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Audience Growth</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
              <div key={i} className="w-full bg-[#2D1F23] rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-[#7C2D3E] rounded-t-sm hover:bg-[#9B3A4D] transition-colors" 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F0A0B] border border-[#2D1F23] text-xs py-1 px-2 rounded z-10">
                  {height * 10}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-[#8B7078]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>
        
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Content Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#F5E6EA]">Articles</span>
                <span className="text-[#8B7078]">45</span>
              </div>
              <div className="w-full bg-[#0F0A0B] rounded-full h-2">
                <div className="bg-[#7C2D3E] h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#F5E6EA]">Achievements</span>
                <span className="text-[#8B7078]">28</span>
              </div>
              <div className="w-full bg-[#0F0A0B] rounded-full h-2">
                <div className="bg-[#9B3A4D] h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#F5E6EA]">Faculty Profiles</span>
                <span className="text-[#8B7078]">12</span>
              </div>
              <div className="w-full bg-[#0F0A0B] rounded-full h-2">
                <div className="bg-[#F5E6EA] h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

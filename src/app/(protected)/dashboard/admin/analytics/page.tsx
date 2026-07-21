import React from 'react';
import { BarChart, Activity, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsCenterPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#800000]">Analytics Deep Dive</h1>
        <p className="text-gray-500 mt-2">Explore granular metrics across specific modules and entities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder cards for drill down features */}
        {[
          { title: 'Student Growth', desc: 'Department & Batch breakdown', icon: Users },
          { title: 'Event Engagement', desc: 'Registrations & Participation', icon: Activity },
          { title: 'Business Traffic', desc: 'Views & Interaction trends', icon: TrendingUp },
          { title: 'Donation Patterns', desc: 'Campaign performance over time', icon: BarChart },
        ].map((module, i) => (
          <div key={i} className="bg-white border border-[#F5F5DC] p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <module.icon className="h-8 w-8 text-[#800000] group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{module.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#F5F5DC] rounded-xl p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
        <BarChart className="h-16 w-16 text-[#800000] opacity-20 mb-4" />
        <h2 className="text-2xl font-semibold text-[#800000]">Select a module to drill down</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Use the deep dive cards above to analyze specific module performance. The analytics engine aggregates data continuously from all active platform systems.
        </p>
      </div>
    </div>
  );
}

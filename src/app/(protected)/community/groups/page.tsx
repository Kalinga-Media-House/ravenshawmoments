import React from 'react';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CommunityGroupsPage() {
  const supabase = (await createClient()) as any;
  const { data: groups } = await supabase.from('community_groups').select('*').eq('visibility', 'public').order('created_at', { ascending: false });

  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl border border-[#F5F5DC] shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-[#800000] mb-2">Community Groups</h1>
        <p className="text-gray-500 mb-6">Join active groups to connect with peers sharing your interests, hobbies, and goals.</p>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search groups..." className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups && groups.length > 0 ? (
          groups.map((group: any) => (
            <Card key={group.id} className="p-5 border-[#F5F5DC] hover:border-[#800000]/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{group.name}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">{group.group_type}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Public Group</span>
                </div>
                <Link href={`/community/group/${group.slug}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  View Group
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center p-12 bg-white rounded-xl border border-[#F5F5DC]">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Groups Found</h3>
            <p className="text-gray-500 mt-1">Community groups are currently being set up.</p>
          </div>
        )}
      </div>
    </div>
  );
}

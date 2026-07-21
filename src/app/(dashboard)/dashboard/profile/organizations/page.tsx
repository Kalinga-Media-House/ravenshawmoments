import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { OrganizationMemberRepository } from '@/repositories/organization/organizationMember.repository';
import Link from 'next/link';

export default async function StudentOrganizationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Organizations</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">You aren't part of any organizations yet.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Join clubs, societies, NCC, or NSS to enrich your university experience and track your volunteer hours.
        </p>
        <Link 
          href="/organizations" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
        >
          Explore Organizations
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Open Recruitments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">NSS Volunteering Campaign 2026</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Open to all 1st and 2nd year UG students.</p>
            <button disabled className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
              Applications Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

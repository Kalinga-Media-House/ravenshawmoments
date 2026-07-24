import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CompanyService } from '@/features/placement/services/CompanyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Recruiters - Placements',
  description: 'Explore the companies that hire from Ravenshaw University.',
};

export default async function CompaniesPage() {
  const supabase = await createClient();
  const service = new CompanyService(supabase as any);
  
  let companies: any[] = [];
  try {
    const response = await service.getCompanies({ isActive: true, limit: 100 });
    companies = response.companies || [];
  } catch (error) {
    console.error('Failed to load companies', error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Our Recruiters</h1>
        <p className="mt-2 text-gray-500">Top companies that trust our talent.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {companies.map((company: any) => (
          <Card key={company.id} className="flex flex-col items-center justify-center p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-24 h-24 relative mb-4 flex items-center justify-center bg-gray-50 rounded-full border">
              {company.logo?.url ? (
                <Image src={company.logo.url} alt={company.logo.alt_text || company.name} fill className="object-contain p-2 rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-gray-300">{company.name.substring(0, 1)}</span>
              )}
            </div>
            <h3 className="font-medium text-gray-900">{company.name}</h3>
            {company.industry && <p className="text-xs text-gray-500 mt-1">{company.industry}</p>}
          </Card>
        ))}

        {companies.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-gray-900">No recruiters found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

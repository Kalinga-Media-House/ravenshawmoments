import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStudentsByLevel } from "@/actions/department/students.actions";
import { StudentGrid } from "@/features/department/components/students/StudentGrid";
import { DepartmentStudent } from "@/types/department";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, Atom, Briefcase } from "lucide-react";
import Link from "next/link";
import { RhssStreamFilters } from "../components/RhssStreamFilters";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ stream: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const stream = resolvedParams.stream.charAt(0).toUpperCase() + resolvedParams.stream.slice(1);
  return {
    title: `RHSS ${stream} Stream | Ravenshaw Moments`,
    description: `Explore the students, batches, and memories of the RHSS ${stream} stream.`,
  };
}

export default async function RhssStreamPage({
  params,
  searchParams,
}: {
  params: Promise<{ stream: string }>;
  searchParams: Promise<{ query?: string; batch?: string; year?: string; verified?: string }>;
}) {
  const resolvedParams = await params;
  const streamSlug = resolvedParams.stream.toLowerCase();
  
  if (!["arts", "science", "commerce"].includes(streamSlug)) {
    notFound();
  }

  const streamName = streamSlug.charAt(0).toUpperCase() + streamSlug.slice(1);
  const resolvedSearchParams = await searchParams;
  
  // Fetch students for this stream
  const studentsRes = await getStudentsByLevel("+2", { stream: streamName });
  let students = (studentsRes.success ? studentsRes.data : []) as DepartmentStudent[];

  // Get unique batches from students
  const availableBatches = Array.from(new Set(
    students.map(s => s.batch_id).filter((b): b is string => Boolean(b))
  )).sort((a, b) => b.localeCompare(a));

  // Client-side like filtering applied on server for demonstration (since action doesn't take all filters yet)
  if (resolvedSearchParams.query) {
    const q = resolvedSearchParams.query.toLowerCase();
    students = students.filter(s => s.profile?.full_name?.toLowerCase().includes(q));
  }
  
  const batchParam = resolvedSearchParams.batch || resolvedSearchParams.year;
  if (batchParam) {
    let targetBatchId = batchParam;
    if (targetBatchId.includes("-")) {
      targetBatchId = targetBatchId.split("-")[1];
    }
    students = students.filter(s => s.batch_id === targetBatchId);
  }
  
  if (resolvedSearchParams.verified === 'true') {
    students = students.filter(s => s.is_verified_by_cr);
  }


  const getIcon = () => {
    switch (streamSlug) {
      case "arts": return <BookOpen className="h-12 w-12 text-[#D4AF37] mb-4" />;
      case "science": return <Atom className="h-12 w-12 text-[#D4AF37] mb-4" />;
      case "commerce": return <Briefcase className="h-12 w-12 text-[#D4AF37] mb-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="bg-[#3A000E] py-16 border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          {getIcon()}
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4">
            RHSS {streamName} Stream
          </h1>
          <p className="text-[#FFF9F1]/80 max-w-2xl text-lg mb-8">
            Explore the {streamName} student directory and browse memories from all graduating batches of Ravenshaw Higher Secondary School.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-6">
            <RhssStreamFilters
              initialQuery={resolvedSearchParams.query}
              initialBatch={resolvedSearchParams.batch || resolvedSearchParams.year}
              availableBatches={availableBatches}
            />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-12">
            

            {/* Student Directory */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b pb-2">
                <h2 className="text-2xl font-bold font-serif text-[#3A000E] dark:text-[#E8B83F]">
                  Student Directory <span className="text-muted-foreground text-lg ml-2 font-sans">({students.length})</span>
                </h2>
              </div>
              <StudentGrid students={students as any} />
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

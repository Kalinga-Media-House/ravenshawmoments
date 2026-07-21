import React from "react";
import { Metadata } from "next";
import { getStudentsByLevel } from "@/actions/department/students.actions";
import { StudentGrid } from "@/features/department/components/students/StudentGrid";
import { DepartmentStudent } from "@/types/department";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ batch: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `RHSS Batch ${resolvedParams.batch} | Ravenshaw Moments`,
    description: `Explore the students and memories of the RHSS Class of ${resolvedParams.batch}.`,
  };
}

export default async function RhssBatchPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const resolvedParams = await params;
  const batch = resolvedParams.batch;
  
  let targetBatchId = batch;
  if (targetBatchId.includes("-")) {
    targetBatchId = targetBatchId.split("-")[1];
  }

  // Fetch +2 students for the specific batch
  const studentsRes = await getStudentsByLevel("+2", { batch_year: targetBatchId });
  let students = (studentsRes.success ? studentsRes.data : []) as DepartmentStudent[];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="bg-[#3A000E] py-16 border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <Calendar className="h-12 w-12 text-[#D4AF37] mb-4" />
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4">
            RHSS Batch {batch}
          </h1>
          <p className="text-[#FFF9F1]/80 max-w-2xl text-lg mb-8">
            Reconnecting the graduates of batch {batch}. Explore the directory of students across all streams for this graduating class.
          </p>
          <div className="flex gap-4">
            <Link href="/rhss">
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
                Back to RHSS Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#3A000E] dark:text-[#E8B83F]">
              Batch Directory
            </h2>
            <p className="text-muted-foreground mt-1">Found {students.length} students from Batch {batch}</p>
          </div>
        </div>
        
        <StudentGrid students={students as any} />
      </div>
    </div>
  );
}

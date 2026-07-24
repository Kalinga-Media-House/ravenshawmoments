import React, { Suspense } from "react";
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PlacementDriveRepository } from '@/features/placement/repositories/PlacementDriveRepository';
import { 
  Briefcase, 
  Building, 
  Users, 
  IndianRupee, 
  Target, 
  Lightbulb, 
  Award, 
  CheckCircle,
  ChevronDown,
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
  FileText,
  MessagesSquare,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Placement & Career Development | Ravenshaw Moments',
  description: 'Official Career Services Portal at Ravenshaw University. Explore career opportunities, internships, placements, and employer partnerships.',
};

export default async function PlacementsPage() {
  const supabase = await createClient();
  const driveRepo = new PlacementDriveRepository(supabase as any);
  
  let upcomingDrives: any[] = [];

  try {
    // Fetch recent/upcoming drives
    const { drives } = await driveRepo.getDrives({ limit: 4 });
    upcomingDrives = drives || [];
  } catch (error) {
    console.error('Failed to load placement data', error);
  }

  const careerResources = [
    { title: "Resume Building", description: "Craft a professional resume that highlights your strengths and academic achievements.", icon: <FileText className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Interview Preparation", description: "Learn how to tackle technical and HR rounds with confidence through targeted prep sessions.", icon: <MessagesSquare className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Mock Interviews", description: "Practice with industry experts and alumni to refine your communication and problem-solving skills.", icon: <Users className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Skill Development", description: "Access workshops on the latest industry tools, coding practices, and soft skills.", icon: <Laptop className="w-6 h-6 text-[#C8A046]" /> },
  ];

  const faqs = [
    { question: "How do I register for placement drives?", answer: "Students can register for upcoming placement drives directly through this portal using their official university email ID. Navigate to the 'Upcoming Placement Drives' section, select a drive, and click 'Apply'." },
    { question: "What are the general eligibility criteria?", answer: "Eligibility varies by company. Common criteria include a minimum CGPA (usually 6.0 or above), no active backlogs, and specific degree requirements which will be explicitly stated for each drive." },
    { question: "Where should I upload my resume?", answer: "You can upload and manage your professional resume in your Student Dashboard under the 'Career' tab. Ensure it is updated before applying to any drive." },
    { question: "What is the typical recruitment process?", answer: "The process generally involves: 1. Registration, 2. Pre-Placement Talk, 3. Online/Aptitude Assessment, 4. Technical Interview, 5. HR Interview, and finally 6. The Offer Letter." },
    { question: "Can I accept multiple offer letters?", answer: "According to the university placement policy, once a student secures an offer from a company, they may only be eligible to participate in further drives if the new company offers a significantly higher package ('Dream Status'). Please refer to the detailed Placement Policy document in your dashboard." },
  ];

  const placementProcess = [
    { step: 1, title: "Registration", icon: <Laptop className="w-5 h-5 text-[#3A0016]" /> },
    { step: 2, title: "Eligibility", icon: <CheckCircle className="w-5 h-5 text-[#3A0016]" /> },
    { step: 3, title: "Assessment", icon: <FileText className="w-5 h-5 text-[#3A0016]" /> },
    { step: 4, title: "Interview", icon: <MessagesSquare className="w-5 h-5 text-[#3A0016]" /> },
    { step: 5, title: "Offer Letter", icon: <Award className="w-5 h-5 text-[#3A0016]" /> },
    { step: 6, title: "Joining", icon: <Briefcase className="w-5 h-5 text-[#3A0016]" /> },
  ];

  return (
    <div className="flex flex-col w-full bg-[#F8F4EC] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/hero-1.webp"
            alt="Ravenshaw University Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#3A0016]/85 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A0016] via-[#3A0016]/70 to-[#3A0016]/30 z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#1a000a]/60 z-30 mix-blend-overlay" />
        </div>

        <div className="container relative z-40 px-4 md:px-6 flex flex-col items-center text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A046]/20 border border-[#C8A046]/50 text-[#C8A046] text-xs font-black uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg">
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Official Career Services Portal</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8F4EC] mb-4 font-serif drop-shadow-lg">
            Placement & Career Development
          </h1>
          
          <p className="text-sm md:text-lg text-[#F8F4EC]/90 max-w-2xl font-medium leading-relaxed mb-8 text-shadow-sm">
            Empowering students with top-tier internships, placements, career guidance, and robust employer partnerships globally.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/placements/jobs">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 h-12 text-base shadow-xl transition-transform hover:scale-105">
                Explore Opportunities
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10 font-bold px-8 h-12 text-base shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold font-serif text-[#3A0016] mb-4">Shaping the Leaders of Tomorrow</h2>
                <div className="w-16 h-1 bg-[#C8A046] rounded-full mb-6" />
                <p className="text-[#5A1024]/80 text-lg leading-relaxed">
                  The Placement and Career Development Cell at Ravenshaw University bridges the gap between academia and industry. We are dedicated to nurturing talent, honing professional skills, and facilitating premier recruitment opportunities for our exceptional students.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#F8F4EC] p-6 rounded-xl border border-[#3A0016]/10">
                  <Target className="w-8 h-8 text-[#C8A046] mb-4" />
                  <h3 className="font-bold text-[#3A0016] text-lg mb-2">Our Mission</h3>
                  <p className="text-sm text-[#5A1024]/70 leading-relaxed">To equip students with industry-relevant skills and connect them with global opportunities that align with their career aspirations.</p>
                </div>
                <div className="bg-[#F8F4EC] p-6 rounded-xl border border-[#3A0016]/10">
                  <Lightbulb className="w-8 h-8 text-[#C8A046] mb-4" />
                  <h3 className="font-bold text-[#3A0016] text-lg mb-2">Our Vision</h3>
                  <p className="text-sm text-[#5A1024]/70 leading-relaxed">To be the preferred talent sourcing destination for top-tier organizations across the globe.</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group border-4 border-white">
               <Image 
                  src="/hero/hero-2.webp"
                  alt="Career Development Session"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-[#3A0016]/20 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Placement Drives */}
      <section className="py-20 bg-[#F8F4EC]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Upcoming Drives</h2>
              <div className="w-16 h-1 bg-[#C8A046] rounded-full" />
            </div>
            <Link href="/placements/jobs" className="mt-6 sm:mt-0 flex items-center text-[#3A0016] font-bold hover:text-[#C8A046] transition-colors">
              View All Drives <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {upcomingDrives && upcomingDrives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingDrives.map((drive: any, idx: number) => (
                <Card key={idx} className="bg-white border-[#3A0016]/10 hover:border-[#C8A046]/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="h-2 w-full bg-[#C8A046]" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#F8F4EC] border border-[#3A0016]/10 flex items-center justify-center overflow-hidden">
                           {drive.company?.logo ? (
                             <Image src={`https://media.ravenshawmoments.com/${drive.company.logo.public_id}`} alt={drive.company?.name || 'Company'} width={48} height={48} className="object-contain" />
                           ) : (
                             <Building2 className="w-8 h-8 text-[#3A0016]/40" />
                           )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#3A0016] text-xl group-hover:text-[#C8A046] transition-colors">{drive.title || drive.job_type}</h3>
                          <p className="text-sm font-medium text-[#5A1024]/70">{drive.company?.name || 'Partner Company'}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">
                        {drive.status || 'Active'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-[#5A1024]/80">
                         <GraduationCap className="w-4 h-4 text-[#C8A046] mr-2" />
                         <span className="truncate">All Streams Eligible</span>
                      </div>
                      <div className="flex items-center text-sm text-[#5A1024]/80">
                         <Calendar className="w-4 h-4 text-[#C8A046] mr-2" />
                         <span>{new Date(drive.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-[#5A1024]/80">
                         <MapPin className="w-4 h-4 text-[#C8A046] mr-2" />
                         <span>On-Campus</span>
                      </div>
                      <div className="flex items-center text-sm text-[#5A1024]/80">
                         <IndianRupee className="w-4 h-4 text-[#C8A046] mr-2" />
                         <span>Disclosed Later</span>
                      </div>
                    </div>

                    <Link href={`/placements/jobs`}>
                      <Button className="w-full bg-[#3A0016] text-white hover:bg-[#5A1024] font-bold">
                        View Details & Apply
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#3A0016]/10 p-12 text-center shadow-sm">
               <Briefcase className="w-16 h-16 text-[#C8A046]/40 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-[#3A0016] mb-2 font-serif">No Upcoming Drives</h3>
               <p className="text-[#5A1024]/70 max-w-md mx-auto">
                 There are currently no active placement drives taking registrations. Please check back soon or ensure your profile is complete.
               </p>
            </div>
          )}
        </div>
      </section>

      {/* Placement Process Timeline */}
      <section className="py-20 bg-white border-y border-[#3A0016]/10 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">The Recruitment Journey</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#5A1024]/80 text-lg max-w-2xl mx-auto">
              A streamlined, transparent process guiding you from registration to your first day at work.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#C8A046]/30 -translate-y-1/2 z-0" />
            
            {/* Vertical Line for Mobile */}
            <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#C8A046]/30 -translate-x-1/2 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
              {placementProcess.map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl relative">
                  <div className="w-14 h-14 rounded-full bg-[#F8F4EC] border-2 border-[#C8A046] shadow-md flex items-center justify-center mb-4 relative z-10 transition-transform hover:scale-110 duration-300 cursor-default">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#3A0016] text-sm uppercase tracking-wide bg-white px-2">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Resources Section */}
      <section className="py-20 bg-[#F8F4EC]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Career Resources</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#5A1024]/80 text-lg max-w-2xl mx-auto">
              Comprehensive support to prepare you for the competitive professional landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerResources.map((resource, idx) => (
              <Card key={idx} className="bg-white border-[#C8A046]/20 shadow-md hover:shadow-xl hover:border-[#C8A046]/50 transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#3A0016]/5 flex items-center justify-center mb-6">
                    {resource.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#3A0016] mb-3">{resource.title}</h3>
                  <p className="text-sm text-[#5A1024]/70 leading-relaxed">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiters Showcase */}
      <section className="py-20 bg-white border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Our Prominent Recruiters</h2>
          <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-12 rounded-full" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {/* Using elegant placeholders as requested since direct company logos might be sparse */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
               <div key={i} className="w-32 h-16 bg-[#F8F4EC] rounded-lg border border-[#3A0016]/10 flex items-center justify-center grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                 <Building2 className="w-8 h-8 text-[#3A0016]/30" />
               </div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href="/placements/companies">
              <Button variant="outline" className="border-[#3A0016] text-[#3A0016] hover:bg-[#3A0016] hover:text-white font-bold px-8">
                View All Partner Companies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories (Version 1 - Placeholders) */}
      <section className="py-20 bg-[#3A0016] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#F8F4EC]">Alumni Success Stories</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#F8F4EC]/80 text-lg max-w-2xl mx-auto">
              Our graduates are making their mark in leading organizations worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-[#C8A046]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:bg-[#C8A046]/20 transition-colors duration-500" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-[#C8A046] flex items-center justify-center overflow-hidden">
                    <Users className="w-8 h-8 text-white/50" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Student Name</h3>
                    <p className="text-[#C8A046] text-sm font-semibold">Software Engineer</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Placed At</div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Top Tech Company
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Package Offered</div>
                  <div className="font-bold text-[#F8F4EC] flex items-center gap-1 text-xl">
                    <IndianRupee className="w-5 h-5" /> -- Lakhs PA
                  </div>
                </div>
                <p className="text-white/70 italic text-sm leading-relaxed">
                  "The placement cell provided exceptional support during my preparation, organizing mock interviews and connecting us with great opportunities."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-[#F8F4EC] border border-[#3A0016]/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#3A0016] text-lg select-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#C8A046] transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-[#5A1024]/80 leading-relaxed border-t border-[#3A0016]/5 mt-2">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#3A0016] border-t-4 border-[#C8A046] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5A1024] to-[#3A0016] z-0" />
        
        <div className="container relative z-10 px-4 text-center max-w-3xl mx-auto">
          <Briefcase className="h-16 w-16 text-[#C8A046] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black font-serif text-[#F8F4EC] mb-4 drop-shadow-md">
            Launch Your Career with Ravenshaw
          </h2>
          <p className="text-lg text-[#F8F4EC]/80 mb-10 leading-relaxed">
            Take the first step towards a rewarding professional journey. Explore current opportunities or reach out to our cell for guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/placements/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 h-14 text-base shadow-xl w-full transition-transform hover:scale-105">
                Explore Opportunities
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10 font-bold px-8 h-14 text-base shadow-xl w-full backdrop-blur-sm transition-transform hover:scale-105">
                Contact Placement Cell
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

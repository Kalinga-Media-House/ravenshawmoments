import React from "react";
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";
import { HostelList } from "./components/HostelList";
import { 
  Building2, 
  Users, 
  MapPin, 
  Search,
  CheckCircle,
  Shield,
  Wifi,
  BookOpen,
  Coffee,
  HeartPulse,
  Activity,
  Headset,
  Briefcase,
  ChevronDown
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Residential Life & Hostels | Ravenshaw Moments',
  description: 'Explore the vibrant residential life, hostels, and facilities at Ravenshaw University.',
};

export default async function HostelsPage() {
  const supabase = await createClient();
  const { data: hostels, error } = await (supabase as any).from("hostels")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching hostels:", error);
  }

  const facilities = [
    { title: "High-Speed Wi-Fi", description: "Seamless campus-wide connectivity for study and research.", icon: <Wifi className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Study Libraries", description: "Quiet, dedicated spaces in each hostel for focused academics.", icon: <BookOpen className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Dining & Mess", description: "Nutritious and hygienic meals served in spacious dining halls.", icon: <Coffee className="w-6 h-6 text-[#C8A046]" /> },
    { title: "24/7 Security", description: "Round-the-clock surveillance and dedicated wardens for safety.", icon: <Shield className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Medical Support", description: "On-campus health center and emergency assistance.", icon: <HeartPulse className="w-6 h-6 text-[#C8A046]" /> },
    { title: "Sports Facilities", description: "Indoor games, courts, and fitness centers within hostels.", icon: <Activity className="w-6 h-6 text-[#C8A046]" /> },
    { title: "24×7 Assistance", description: "Dedicated helpline and support staff for all residential needs.", icon: <Headset className="w-6 h-6 text-[#C8A046]" /> },
  ];

  const faqs = [
    { question: "How do I apply for a hostel seat?", answer: "Hostel allocation is strictly based on merit and distance from the university. Students must select the hostel option during their admission process and submit the required documentation to the Chief Warden's office." },
    { question: "What are the eligibility criteria?", answer: "Regular, full-time students of UG and PG programs are eligible. Preference is given to outstation students and those securing top ranks in the entrance/merit list." },
    { question: "How are rooms allocated?", answer: "Rooms are allocated by the respective Hostel Wardens. Freshers are typically allotted shared rooms to foster community, while senior students may be eligible for single or double occupancy based on availability." },
    { question: "What are the general hostel rules?", answer: "Residents must strictly adhere to the curfew timings, maintain discipline, and participate in community cleaning drives. Ragging is strictly prohibited and is a punishable offense." },
    { question: "Are meals included in the hostel fees?", answer: "Yes, the standard hostel fee includes mess charges for two primary meals (Lunch and Dinner) along with breakfast. Special dietary requirements can be discussed with the Mess Committee." },
  ];

  return (
    <div className="flex flex-col w-full bg-[#F8F4EC] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden">
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
            <Building2 className="w-4 h-4" aria-hidden="true" />
            <span>University Hostels</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8F4EC] mb-4 font-serif drop-shadow-lg">
            Residential Life at Ravenshaw
          </h1>
          
          <p className="text-sm md:text-lg text-[#F8F4EC]/90 max-w-2xl font-medium leading-relaxed mb-8 text-shadow-sm">
            A vibrant residential community where learning, friendships, leadership, and lifelong memories begin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#directory">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 h-12 text-base shadow-xl transition-transform hover:scale-105">
                Explore Hostels
              </Button>
            </Link>
            <Link href="#guidelines">
              <Button size="lg" variant="outline" className="border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10 font-bold px-8 h-12 text-base shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
                Hostel Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Residential Life */}
      <section className="py-20 bg-white border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[#3A0016] mb-4">A Home Away From Home</h2>
            <div className="w-16 h-1 bg-[#C8A046] rounded-full mx-auto mb-6" />
            <p className="text-[#5A1024]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Ravenshaw's residential life is designed to foster a sense of belonging and holistic growth. Our hostels are more than just accommodations; they are diverse communities where students from various backgrounds live, learn, and grow together in a secure environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-[#F8F4EC] p-8 rounded-2xl border border-[#3A0016]/10 shadow-sm text-center">
               <Shield className="w-10 h-10 text-[#C8A046] mx-auto mb-4" />
               <h3 className="font-bold text-[#3A0016] text-xl mb-3">Safe & Secure</h3>
               <p className="text-sm text-[#5A1024]/70 leading-relaxed">Stringent security protocols, CCTV surveillance, and dedicated residential staff ensure a safe environment for all students.</p>
             </div>
             <div className="bg-[#F8F4EC] p-8 rounded-2xl border border-[#3A0016]/10 shadow-sm text-center">
               <Users className="w-10 h-10 text-[#C8A046] mx-auto mb-4" />
               <h3 className="font-bold text-[#3A0016] text-xl mb-3">Vibrant Community</h3>
               <p className="text-sm text-[#5A1024]/70 leading-relaxed">Engage in cultural events, sports tournaments, and collaborative study groups that define the quintessential Ravenshaw experience.</p>
             </div>
             <div className="bg-[#F8F4EC] p-8 rounded-2xl border border-[#3A0016]/10 shadow-sm text-center">
               <BookOpen className="w-10 h-10 text-[#C8A046] mx-auto mb-4" />
               <h3 className="font-bold text-[#3A0016] text-xl mb-3">Academic Focus</h3>
               <p className="text-sm text-[#5A1024]/70 leading-relaxed">Designed to support academic excellence with dedicated study rooms, high-speed internet, and proximity to university libraries.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Hostel Directory (Client Component) */}
      <section id="directory" className="py-20 bg-[#F8F4EC]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Hostel Directory</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          </div>
          
          <HostelList hostels={hostels || []} />
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="py-20 bg-white border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Campus Facilities</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#5A1024]/80 text-lg max-w-2xl mx-auto">
              Everything you need for a comfortable and productive residential experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((resource, idx) => (
              <Card key={idx} className="bg-[#F8F4EC] border-[#C8A046]/20 shadow-sm hover:shadow-lg hover:border-[#C8A046]/50 transition-all duration-300">
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

      {/* FAQ Section */}
      <section id="guidelines" className="bg-[#F8F4EC] py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white border border-[#3A0016]/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm hover:border-[#C8A046]/40 transition-colors">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#3A0016] text-lg select-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#C8A046] transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-[#5A1024]/80 leading-relaxed border-t border-[#3A0016]/5 mt-2 bg-white">
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
          <Building2 className="h-16 w-16 text-[#C8A046] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black font-serif text-[#F8F4EC] mb-4 drop-shadow-md">
            Experience Residential Life at Ravenshaw
          </h2>
          <p className="text-lg text-[#F8F4EC]/80 mb-10 leading-relaxed">
            Discover a community that shapes leaders, thinkers, and lifelong friends.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#directory" className="w-full sm:w-auto">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 h-14 text-base shadow-xl w-full transition-transform hover:scale-105">
                Explore Hostels
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10 font-bold px-8 h-14 text-base shadow-xl w-full backdrop-blur-sm transition-transform hover:scale-105">
                Contact Hostel Office
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

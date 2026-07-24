import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Atom, 
  Briefcase, 
  Users, 
  GraduationCap,
  Calendar,
  ChevronRight,
  Sparkles,
  Trophy,
  ImageIcon,
  ArrowRight,
  User,
  Star
} from "lucide-react";
export default async function RhssHomePage() {
  const streams = [
    {
      id: "arts",
      title: "Arts",
      description: "Exploring humanities, literature, and social sciences with a rich heritage of producing thought leaders.",
      icon: <BookOpen className="h-8 w-8 text-[#C8A046]" />,
      href: "/rhss/arts",
      studentCount: "1,240+",
      batchCount: "25+",
      image: "/hero/hero-2.webp",
    },
    {
      id: "science",
      title: "Science",
      description: "Discovering the fundamental laws of nature and technology through rigorous academic pursuit.",
      icon: <Atom className="h-8 w-8 text-[#C8A046]" />,
      href: "/rhss/science",
      studentCount: "1,850+",
      batchCount: "25+",
      image: "/hero/hero-3.webp",
    },
    {
      id: "commerce",
      title: "Commerce",
      description: "Mastering finance, trade, and economic principles to build the business leaders of tomorrow.",
      icon: <Briefcase className="h-8 w-8 text-[#C8A046]" />,
      href: "/rhss/commerce",
      studentCount: "1,100+",
      batchCount: "25+",
      image: "/hero/hero-4.webp",
    }
  ];

  const batches = [
    { year: "2024–2026", label: "Class of '26" },
    { year: "2023–2025", label: "Class of '25" },
    { year: "2022–2024", label: "Class of '24" },
    { year: "2021–2023", label: "Class of '23" },
    { year: "2020–2022", label: "Class of '22" },
    { year: "2019–2021", label: "Class of '21" },
    { year: "2018–2020", label: "Class of '20" },
    { year: "2017–2019", label: "Class of '19" },
  ];

  const timelineEvents = [
    { year: "2001", title: "Foundation", description: "Establishment of Ravenshaw Higher Secondary School as a distinct entity." },
    { year: "2006", title: "University Transition", description: "Ravenshaw College upgrades to Ravenshaw University, elevating the campus atmosphere." },
    { year: "2015", title: "Academic Expansion", description: "Introduction of modernized curriculum and upgraded laboratory facilities." },
    { year: "2024", title: "Legacy Continues", description: "Over two decades of excellence, shaping thousands of young minds." }
  ];

  const galleryItems = [
    { title: "Farewell", image: "/hero/hero-5.webp" },
    { title: "Annual Function", image: "/hero/hero-2.webp" },
    { title: "Sports Meet", image: "/hero/hero-3.webp" },
    { title: "NCC Parade", image: "/hero/hero-4.webp" },
  ];

  return (
    <div className="flex flex-col w-full bg-[#F8F4EC] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/hero-1.webp"
            alt="Ravenshaw Higher Secondary School Campus"
            fill
            className="object-cover"
            priority
          />
          {/* Dark maroon overlay with soft vignette and elegant gradient */}
          <div className="absolute inset-0 bg-[#3A0016]/80 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A0016] via-transparent to-[#3A0016]/40 z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#1a000a]/60 z-30 mix-blend-overlay" />
        </div>

        <div className="container relative z-40 px-4 md:px-6 flex flex-col items-center text-center mt-16">
          <Badge className="mb-6 bg-[#C8A046]/20 text-[#C8A046] border border-[#C8A046]/50 px-4 py-1.5 text-sm font-semibold tracking-widest uppercase backdrop-blur-md">
            Since 2001
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8F4EC] mb-4 font-serif drop-shadow-lg">
            Ravenshaw Higher Secondary School
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-[#C8A046] mb-8 font-serif drop-shadow-md">
            RHSS (+2)
          </h2>
          
          <p className="text-lg md:text-xl text-[#F8F4EC]/90 max-w-3xl font-medium leading-relaxed mb-10 text-shadow-sm">
            A premier institution fostering academic excellence, shaping the future of young minds, and preserving a rich legacy of traditions and achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="#streams">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 w-full sm:w-auto h-14 text-lg shadow-xl border border-[#C8A046] transition-all hover:scale-105">
                Explore Streams
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10 font-bold px-8 w-full sm:w-auto h-14 text-lg backdrop-blur-md transition-all hover:scale-105">
                Claim Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Streams Section */}
      <section id="streams" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#3A0016]">Academic Streams</h2>
          <div className="w-24 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          <p className="text-[#5A1024] text-lg max-w-2xl mx-auto font-medium">
            Discover the vibrant community of students across our three foundational streams, built on decades of academic rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {streams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden group border border-[#C8A046]/20 bg-white hover:border-[#C8A046] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[#3A0016]/40 group-hover:bg-[#3A0016]/20 transition-colors duration-500 z-10" />
                <Image
                  src={stream.image}
                  alt={stream.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-20 bg-[#F8F4EC]/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[#C8A046]/30">
                  {stream.icon}
                </div>
              </div>
              <CardContent className="p-8 flex-grow flex flex-col">
                <h3 className="text-3xl font-bold font-serif mb-3 text-[#3A0016]">{stream.title}</h3>
                <p className="text-[#5A1024]/80 text-base mb-8 flex-grow leading-relaxed">
                  {stream.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-[#3A0016]/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#C8A046] uppercase tracking-wider">Students</span>
                    <span className="text-lg font-bold text-[#3A0016] flex items-center gap-2">
                      <Users className="h-4 w-4" /> {stream.studentCount}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#C8A046] uppercase tracking-wider">Batches</span>
                    <span className="text-lg font-bold text-[#3A0016] flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {stream.batchCount}
                    </span>
                  </div>
                </div>

                <Link href={stream.href} className="mt-auto">
                  <Button className="w-full bg-[#3A0016] hover:bg-[#5A1024] text-[#F8F4EC] h-12 text-lg font-semibold group/btn">
                    Explore {stream.title}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Legacy / Timeline Section */}
      <section className="bg-[#3A0016] text-[#F8F4EC] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/hero/hero-1.webp')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#F8F4EC]">Our Legacy</h2>
            <div className="w-24 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#F8F4EC]/80 text-lg max-w-2xl mx-auto">
              Tracing the journey of excellence since the inception of the Higher Secondary School.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-2 border-[#C8A046]/30 ml-4 md:ml-0 md:border-none space-y-12">
              {/* Desktop center line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#C8A046]/30 -translate-x-1/2" />
              
              {timelineEvents.map((event, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-[-21px] md:left-1/2 w-10 h-10 rounded-full bg-[#C8A046] border-4 border-[#3A0016] md:-translate-x-1/2 flex items-center justify-center z-10 shadow-lg">
                    <Sparkles className="h-4 w-4 text-[#3A0016]" />
                  </div>
                  
                  {/* Content Box */}
                  <div className={`ml-8 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                    <Card className="bg-[#5A1024]/80 backdrop-blur-sm border-[#C8A046]/30 hover:border-[#C8A046] transition-colors">
                      <CardContent className="p-6">
                        <span className="text-[#C8A046] font-black text-2xl mb-2 block">{event.year}</span>
                        <h4 className="text-xl font-bold text-[#F8F4EC] mb-2 font-serif">{event.title}</h4>
                        <p className="text-[#F8F4EC]/70 leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spotlights Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#3A0016]">Spotlights</h2>
          <div className="w-24 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          <p className="text-[#5A1024] text-lg max-w-2xl mx-auto font-medium">
            Celebrating the individuals who make Ravenshaw exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Student Spotlight */}
          <Card className="border border-[#C8A046]/20 bg-white shadow-xl flex flex-col overflow-hidden">
            <div className="bg-[#3A0016] p-4 text-center border-b border-[#C8A046]/30">
              <h3 className="text-[#C8A046] font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                <Star className="h-4 w-4" /> Student Spotlight
              </h3>
            </div>
            <CardContent className="p-8 flex items-start gap-6 flex-grow">
              <div className="w-24 h-24 rounded-full bg-[#F8F4EC] border-2 border-[#C8A046] flex-shrink-0 flex items-center justify-center overflow-hidden">
                <User className="h-10 w-10 text-[#C8A046]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold font-serif text-[#3A0016] mb-1">Student Star</h4>
                <p className="text-[#C8A046] font-semibold text-sm mb-3">Class of '24 • Science</p>
                <p className="text-[#5A1024]/80 italic">"An exemplary student representing the true spirit of Ravenshaw through academic excellence and leadership in extracurricular activities."</p>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Spotlight */}
          <Card className="border border-[#C8A046]/20 bg-white shadow-xl flex flex-col overflow-hidden">
            <div className="bg-[#3A0016] p-4 text-center border-b border-[#C8A046]/30">
              <h3 className="text-[#C8A046] font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                <Star className="h-4 w-4" /> Teacher Spotlight
              </h3>
            </div>
            <CardContent className="p-8 flex items-start gap-6 flex-grow">
              <div className="w-24 h-24 rounded-full bg-[#F8F4EC] border-2 border-[#C8A046] flex-shrink-0 flex items-center justify-center overflow-hidden">
                <GraduationCap className="h-10 w-10 text-[#C8A046]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold font-serif text-[#3A0016] mb-1">Distinguished Faculty</h4>
                <p className="text-[#C8A046] font-semibold text-sm mb-3">Department of Commerce</p>
                <p className="text-[#5A1024]/80 italic">"Dedicated to nurturing minds and inspiring a generation of critical thinkers. A pillar of the RHSS academic community."</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Memory Gallery Preview */}
      <section className="bg-white py-24 border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#3A0016]">Memory Gallery</h2>
              <div className="w-16 h-1 bg-[#C8A046] mb-6 rounded-full" />
              <p className="text-[#5A1024] text-lg max-w-xl">
                A glimpse into the vibrant campus life, cultural fests, and unforgettable moments at RHSS.
              </p>
            </div>
            <Link href="/gallery">
              <Button variant="outline" className="border-[#C8A046] text-[#3A0016] hover:bg-[#C8A046]/10 font-bold h-12 px-6">
                View Full Gallery <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-md">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A0016]/90 via-[#3A0016]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white font-bold text-xl font-serif">{item.title}</h4>
                  <div className="w-8 h-0.5 bg-[#C8A046] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Directory Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#3A0016]">Batch Directory</h2>
          <div className="w-24 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          <p className="text-[#5A1024] text-lg max-w-2xl mx-auto font-medium">
            Find your batchmates and reconnect with the friends who made your +2 journey memorable.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {batches.map((batch) => (
            <Link key={batch.year} href={`/rhss/batch/${batch.year}`}>
              <Card className="group border border-[#C8A046]/20 bg-white hover:bg-[#3A0016] transition-colors duration-300 shadow-sm hover:shadow-xl cursor-pointer h-full">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <Calendar className="h-8 w-8 text-[#C8A046] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-black text-xl text-[#3A0016] group-hover:text-white transition-colors">{batch.year}</span>
                  <span className="text-sm font-semibold text-[#5A1024]/60 group-hover:text-[#C8A046] mt-2 transition-colors uppercase tracking-widest">{batch.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="link" className="text-[#3A0016] hover:text-[#C8A046] font-bold text-lg">
            View Older Batches <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#3A0016] border-t-4 border-[#C8A046] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5A1024] to-[#3A0016] z-0" />
        
        <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
          <Trophy className="h-16 w-16 text-[#C8A046] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black font-serif text-white mb-6 leading-tight drop-shadow-md">
            Be Part of the Ravenshaw Legacy
          </h2>
          <p className="text-xl text-[#F8F4EC]/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Claim your profile today to reconnect with alumni, share your memories, and contribute to the ever-growing RHSS community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/register">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-10 h-14 text-lg shadow-xl w-full sm:w-auto hover:scale-105 transition-transform">
                Claim Your Profile
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-10 h-14 text-lg backdrop-blur-sm w-full sm:w-auto hover:scale-105 transition-transform">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full transition-colors focus:outline-none ${className}`}>
      {children}
    </span>
  );
}

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
  ImageIcon
} from "lucide-react";
import { getStatisticsByLevel } from "@/actions/department/analytics.actions";

export default async function RhssHomePage() {
  const statsRes = await getStatisticsByLevel("+2");
  const stats = statsRes.success ? statsRes.data : null;
  const streams = [
    {
      id: "arts",
      title: "Arts",
      description: "Exploring humanities, literature, and social sciences.",
      icon: <BookOpen className="h-6 w-6 text-[#D9A441]" />,
      href: "/rhss/arts",
      studentCount: "1,240+",
      batchCount: "25+",
      image: "/placeholder-hero.webp",
    },
    {
      id: "science",
      title: "Science",
      description: "Discovering the fundamental laws of nature and technology.",
      icon: <Atom className="h-6 w-6 text-[#D9A441]" />,
      href: "/rhss/science",
      studentCount: "1,850+",
      batchCount: "25+",
      image: "/placeholder-hero.webp",
    },
    {
      id: "commerce",
      title: "Commerce",
      description: "Mastering finance, trade, and economic principles.",
      icon: <Briefcase className="h-6 w-6 text-[#D9A441]" />,
      href: "/rhss/commerce",
      studentCount: "1,100+",
      batchCount: "25+",
      image: "/placeholder-hero.webp",
    }
  ];

  const batches = [
    { year: "2024-2026", label: "Class of '26" },
    { year: "2023-2025", label: "Class of '25" },
    { year: "2022-2024", label: "Class of '24" },
    { year: "2021-2023", label: "Class of '23" },
    { year: "2020-2022", label: "Class of '22" },
    { year: "2019-2021", label: "Class of '21" },
    { year: "2018-2020", label: "Class of '20" },
    { year: "2017-2019", label: "Class of '19" },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#3A000E]/80 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
          <Image
            src="/placeholder-hero.webp"
            alt="Ravenshaw Higher Secondary School"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container relative z-30 px-4 md:px-6 flex flex-col items-center text-center mt-12">
          <Badge className="mb-4 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50 px-3 py-1 text-sm font-medium">
            Since 2001
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 font-serif">
            Ravenshaw Higher Secondary School
            <span className="block text-[#D4AF37] mt-2 text-3xl md:text-5xl">(RHSS +2)</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed mb-8">
            Preserving the memories, friendships, achievements, and journeys of Ravenshaw's +2 students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#streams">
              <Button size="lg" className="bg-[#D4AF37] text-[#3A000E] hover:bg-[#F5C76A] font-bold px-8 w-full sm:w-auto h-12 text-base shadow-xl">
                Explore Streams
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold px-8 w-full sm:w-auto h-12 text-base backdrop-blur-sm">
                Claim Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Streams Section */}
      <section id="streams" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif mb-4 text-[#3A000E] dark:text-[#E8B83F]">Academic Streams</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the vibrant community of students across our three foundational streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {streams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden group border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card">
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <Image
                  src={stream.image}
                  alt={stream.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md p-2 rounded-lg">
                  {stream.icon}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold font-serif mb-2">{stream.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                  {stream.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {stream.studentCount}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {stream.batchCount} Batches
                  </div>
                </div>
                <Link href={stream.href}>
                  <Button className="w-full bg-[#3A000E] hover:bg-[#5A0016] text-white">
                    Explore {stream.title}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Batch Memories Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-4 text-[#3A000E] dark:text-[#E8B83F]">Batch Memories</h2>
              <p className="text-muted-foreground max-w-2xl">
                Relive the moments and reconnect with classmates from your specific graduating year.
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All Batches
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {batches.map((batch) => (
              <Link key={batch.year} href={`/rhss/batch/${batch.year}`}>
                <div className="group relative flex flex-col items-center justify-center p-6 bg-card border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-lg">{batch.year}</span>
                  <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics & Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#3A000E] dark:text-[#E8B83F]">
              A Legacy of Excellence in Higher Secondary Education
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              RHSS has consistently nurtured the brightest minds, providing a robust foundation before they step into higher education. Our diverse streams ensure comprehensive development and academic rigor.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h4 className="text-4xl font-black text-primary">{stats?.students_count || "4,190+"}</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verified Profiles</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-4xl font-black text-primary">{stats?.achievements_count || "850+"}</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Achievements</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-black text-primary">100%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ravenshaw Pride</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card className="bg-primary/5 border-none shadow-none">
                <CardContent className="p-6">
                  <ImageIcon className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Vast Gallery</h4>
                  <p className="text-sm text-muted-foreground">Explore thousands of campus moments across decades.</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-none shadow-none translate-x-4">
                <CardContent className="p-6">
                  <Trophy className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Hall of Fame</h4>
                  <p className="text-sm text-muted-foreground">Celebrating academic and extracurricular excellence.</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4 pt-12">
              <Card className="bg-primary/5 border-none shadow-none">
                <CardContent className="p-6">
                  <Sparkles className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Rich Legacy</h4>
                  <p className="text-sm text-muted-foreground">Preserving the heritage of one of India's oldest institutions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

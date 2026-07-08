import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";
import { ContentService } from "@/features/shared/services/content.service";
import { NoticeList, PublicationList, EventList } from "@/features/shared/components";

export default async function PublicHomepage() {
  const feed = await ContentService.getHomepageFeed();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Ravenshaw University Campus"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
              <span className="text-primary-foreground font-medium text-sm tracking-wide uppercase">
                Welcome to the Legacy
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Preserving Memories.<br/>
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Connecting Generations.
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              The premier digital community platform for Ravenshaw University students, alumni, and faculty. Discover events, celebrate achievements, and stay connected.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/organizations" 
                className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/30"
              >
                Explore Campus
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about" 
                className="flex items-center justify-center gap-2 bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all hover:scale-105"
              >
                Our Heritage
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
      </section>

      {/* Pillars */}
      <section className="py-24 bg-background relative z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">The Pulse of Ravenshaw</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A unified platform seamlessly connecting every corner of our vibrant university ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Academic Departments", desc: "Access verified publications, faculty profiles, and departmental notices." },
              { icon: Trophy, title: "Clubs & Societies", desc: "Discover upcoming events, browse galleries, and join active student bodies." },
              { icon: Users, title: "Hostel Communities", desc: "Stay updated with hostel announcements and boarder achievements." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Latest News</h2>
              <Link href="/news" className="text-primary hover:underline font-medium">View All</Link>
            </div>
            {feed.news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NoticeList notices={feed.news} />
              </div>
            ) : (
              <p className="text-muted-foreground">No recent news available.</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <Link href="/events" className="text-primary hover:underline font-medium">View All</Link>
            </div>
            {feed.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventList events={feed.events} />
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming events scheduled.</p>
            )}
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold mb-2">9+</div>
              <div className="text-primary-foreground/80 font-medium tracking-wide">Hostels</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">30+</div>
              <div className="text-primary-foreground/80 font-medium tracking-wide">Departments</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">50+</div>
              <div className="text-primary-foreground/80 font-medium tracking-wide">Organizations</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">10k+</div>
              <div className="text-primary-foreground/80 font-medium tracking-wide">Alumni & Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Voices of Ravenshaw</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Hear from our vibrant community of students and esteemed alumni.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Das", role: "Alumna, Class of 2018", quote: "Ravenshaw Moments brings back the nostalgia of my hostel days. It's beautiful to see the heritage preserved digitally." },
              { name: "Rahul Mohanty", role: "Current Student, Physics Dept", quote: "The global events calendar and publication access has transformed how we collaborate across departments." },
              { name: "Dr. A. Nayak", role: "Faculty Member", quote: "A monumental step for Ravenshaw. The verified achievements and seamless organization directories are world-class." }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-muted/50 border relative">
                <div className="text-primary text-6xl absolute top-4 left-6 opacity-20">"</div>
                <p className="text-lg mb-6 relative z-10 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <span className="text-sm text-muted-foreground">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & Contributors CTA */}
      <section className="py-24 bg-muted border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Legacy</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Subscribe to our newsletter for the latest campus news, or join our open-source contributor network to help build the future of Ravenshaw Moments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full sm:w-96 px-6 py-4 rounded-full border bg-background focus:ring-2 focus:ring-primary outline-none"
            />
            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
             <Link href="/about" className="hover:text-primary transition-colors">About the Project</Link>
             <Link href="/donate" className="hover:text-primary transition-colors">Become a Sponsor</Link>
             <Link href="/contact" className="hover:text-primary transition-colors">Contribute Code</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Trophy, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Ravenshaw Moments",
  description: "Learn about the heritage and mission of Ravenshaw Moments.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight">Our Heritage</h1>
      <div className="relative w-full h-[400px] bg-muted rounded-2xl overflow-hidden mb-12 shadow-xl">
         <Image 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Ravenshaw University"
            fill
            className="object-cover"
            priority
         />
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
        <p className="lead text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Ravenshaw Moments is the premier digital ecosystem connecting students, alumni, and faculty. We preserve the legacy of our historic institution while fostering modern academic collaboration.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose mb-12">
           <div className="p-6 bg-card border rounded-2xl text-center shadow-sm">
             <BookOpen className="w-10 h-10 mx-auto text-primary mb-4" />
             <h3 className="text-xl font-bold mb-2">Academic Excellence</h3>
             <p className="text-muted-foreground">Showcasing research, publications, and scholastic achievements across all departments.</p>
           </div>
           <div className="p-6 bg-card border rounded-2xl text-center shadow-sm">
             <Trophy className="w-10 h-10 mx-auto text-primary mb-4" />
             <h3 className="text-xl font-bold mb-2">Vibrant Culture</h3>
             <p className="text-muted-foreground">Celebrating the festivals, competitions, and arts that make our campus alive.</p>
           </div>
           <div className="p-6 bg-card border rounded-2xl text-center shadow-sm">
             <Users className="w-10 h-10 mx-auto text-primary mb-4" />
             <h3 className="text-xl font-bold mb-2">Strong Community</h3>
             <p className="text-muted-foreground">Connecting generations of Ravenshavians from hostels to global alumni networks.</p>
           </div>
        </div>

        <h2>Our Mission</h2>
        <p>To digitize and democratize access to university resources, ensuring that every notice, event, and memory is preserved for future generations.</p>
      </div>
    </div>
  );
}

import React from "react";
import { Metadata } from "next";
import { Heart, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Us | Ravenshaw Moments",
  description: "Contribute to the continuous development of Ravenshaw Moments.",
};

export default function DonatePage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl text-center">
      <div className="inline-block p-4 bg-primary/10 text-primary rounded-full mb-6">
         <Heart className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Support Our Vision</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        Ravenshaw Moments is maintained by passionate alumni and students. Your support helps us keep the servers running, expand features, and preserve our university's digital legacy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
         <div className="p-8 bg-card border rounded-3xl shadow-sm relative overflow-hidden group hover:border-primary transition-colors">
            <h3 className="text-2xl font-bold mb-2">Student</h3>
            <p className="text-muted-foreground mb-6">Support infrastructure</p>
            <div className="text-4xl font-extrabold mb-6">₹500<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <button className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">Select Tier</button>
         </div>
         <div className="p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-2 bg-white/20 rounded-bl-xl text-xs font-bold tracking-wider">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2">Alumni</h3>
            <p className="text-primary-foreground/80 mb-6">Fund new features</p>
            <div className="text-4xl font-extrabold mb-6">₹2000<span className="text-lg text-primary-foreground/70 font-normal">/mo</span></div>
            <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">Select Tier</button>
         </div>
         <div className="p-8 bg-card border rounded-3xl shadow-sm relative overflow-hidden group hover:border-primary transition-colors">
            <h3 className="text-2xl font-bold mb-2">Patron</h3>
            <p className="text-muted-foreground mb-6">Endowment support</p>
            <div className="text-4xl font-extrabold mb-6">₹5000<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <button className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">Select Tier</button>
         </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
         <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500"/> Secure payments via Razorpay</div>
         <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500"/> Instant account badge unlock</div>
      </div>
    </div>
  );
}

import React from "react";
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Ravenshaw Moments",
  description: "Get in touch with the Ravenshaw Moments team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center tracking-tight">Contact Us</h1>
      <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Have questions, suggestions, or want to contribute? We'd love to hear from you.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl shadow-sm">
             <div className="p-3 bg-primary/10 rounded-full text-primary"><MapPin className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1">Campus Address</h3>
                <p className="text-muted-foreground">Ravenshaw University<br/>College Square, Cuttack<br/>Odisha 753003, India</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl shadow-sm">
             <div className="p-3 bg-primary/10 rounded-full text-primary"><Mail className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1">Email Support</h3>
                <p className="text-muted-foreground">support@ravenshawmoments.com<br/>alumni@ravenshawmoments.com</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl shadow-sm">
             <div className="p-3 bg-primary/10 rounded-full text-primary"><Phone className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1">Phone</h3>
                <p className="text-muted-foreground">+91 (123) 456-7890<br/>Mon-Fri, 10am-5pm IST</p>
             </div>
          </div>
        </div>

        <form className="p-8 bg-card border rounded-3xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input id="name" type="text" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input id="email" type="email" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea id="message" rows={5} className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors">Send Message</button>
        </form>
      </div>
    </div>
  );
}

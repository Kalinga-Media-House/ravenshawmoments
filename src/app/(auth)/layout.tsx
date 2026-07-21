import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Pane - Branding & Image */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent z-10" />
        <div className="absolute z-20 flex flex-col items-center justify-center text-primary-foreground text-center px-12">
          <Link href="/" className="mb-8 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <Image 
                src="/logo.webp" 
                alt="Ravenshaw Moments Logo" 
                fill 
                className="object-contain"
                sizes="96px"
                priority
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Ravenshaw Moments</h1>
          </Link>
          <p className="text-xl max-w-md leading-relaxed opacity-90">
            Preserving Memories. Celebrating Achievements. Connecting Generations.
          </p>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md relative">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <Image 
                  src="/logo.webp" 
                  alt="Ravenshaw Moments Logo" 
                  fill 
                  className="object-contain"
                  sizes="64px"
                  priority
                />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">Ravenshaw Moments</h1>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

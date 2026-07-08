import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Ravenshaw Moments | Enterprise University Community Platform",
    template: "%s | Ravenshaw Moments",
  },
  description:
    "Preserving Memories. Celebrating Achievements. Connecting Generations. The premier digital community platform for Ravenshaw University students, alumni, and faculty.",
  keywords: [
    "Ravenshaw University",
    "Ravenshaw Moments",
    "Alumni Network",
    "University Community",
    "Academic Achievements",
    "Student Hostels",
  ],
  authors: [{ name: "Ravenshaw Moments Architecture Team" }],
  creator: "Ravenshaw Moments",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ravenshawmoments.com",
    title: "Ravenshaw Moments | Preserving Memories & Celebrating Achievements",
    description:
      "Connect with generations of Ravenshaw University students, alumni, and faculty. Discover events, competitions, galleries, and verified academic achievements.",
    siteName: "Ravenshaw Moments",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravenshaw Moments",
    description: "Preserving Memories. Celebrating Achievements. Connecting Generations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
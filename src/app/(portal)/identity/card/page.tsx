import { getMyCard } from '@/features/identity/actions/identity.actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader, PageActions } from '@/features/shared/components/PageLayout';
import { StatusBadge } from '@/features/shared/components/StatusBadge';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, QrCode, ArrowLeft, Download, Award, Building2, Calendar, CheckCircle2 } from 'lucide-react';

export default async function DigitalCardPage() {
  const card = await getMyCard();

  if (!card) {
    redirect('/identity');
  }

  const profile = card.digital_identities.profiles;
  const identity = card.digital_identities;

  return (
    <PageContainer size="md">
      <PageHeader
        title="Digital ID Card"
        subtitle="Your official verified digital identity credential for campus access, events, and library services."
        badge={<StatusBadge status="verified" label="Active Credential" />}
        actions={
          <PageActions>
            <Link href="/identity">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="size-4" />
                <span>Back to Center</span>
              </Button>
            </Link>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Download className="size-4" />
              <span>Download ID Pass</span>
            </Button>
          </PageActions>
        }
      />

      <div className="max-w-md mx-auto py-4">
        {/* Premium Digital ID Card Container */}
        <div className="relative overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/40 shadow-2xl transition-transform duration-300 hover:scale-[1.01] bg-gradient-to-br from-[#8F0028] via-[#6B001E] to-[#2A0810] text-white">
          {/* Subtle Watermark & Architectural Rings */}
          <div className="absolute -top-16 -right-16 size-64 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full border border-[#D4AF37]/10 pointer-events-none" />

          {/* Top Header Bar */}
          <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/15 bg-black/20 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B5902B] flex items-center justify-center text-[#2A0810] font-black text-lg shadow-md">
                R
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white leading-none">
                  Ravenshaw
                </h2>
                <p className="text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase mt-0.5">
                  University
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/15 text-white border border-white/20 shadow-inner">
                <Award className="size-3 text-[#D4AF37]" />
                <span>{identity.identity_type.replace('_', ' ')}</span>
              </span>
            </div>
          </div>

          {/* Card Body & Profile Section */}
          <div className="relative z-10 p-6 space-y-6">
            <div className="flex gap-4 items-center">
              {/* Profile Avatar with Gold Border */}
              <div className="size-24 rounded-2xl bg-white/10 border-2 border-[#D4AF37] overflow-hidden shadow-xl shrink-0 relative group">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile avatar"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-3xl font-black bg-gradient-to-br from-[#4A0E1B] to-[#2A0810]">
                    {profile.full_name?.charAt(0) || "R"}
                  </div>
                )}
              </div>

              {/* Identity Metadata */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-white leading-tight truncate">
                    {profile.full_name}
                  </h3>
                  <CheckCircle2 className="size-4 text-[#D4AF37] shrink-0 fill-current text-[#D4AF37] stroke-[#8F0028]" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/30 border border-white/10 text-xs text-[#D4AF37] font-mono">
                  <span>ID:</span>
                  <span className="font-bold text-white">{identity.identity_number}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-white/80 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-[#D4AF37]" />
                    <span>Valid thru: {new Date(identity.expiry_date).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white/95 text-black p-5 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-white mx-auto max-w-[220px]">
              <div className="relative size-36 bg-white rounded-xl p-2 flex items-center justify-center border border-gray-200">
                {/* Visual QR Code Representation with Center Seal */}
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 p-1 bg-black/90 rounded-lg">
                  <div className="col-span-2 row-span-2 bg-white border-2 border-black rounded-xs flex items-center justify-center">
                    <div className="size-2 bg-black rounded-2xs" />
                  </div>
                  <div className="col-start-5 col-span-2 row-span-2 bg-white border-2 border-black rounded-xs flex items-center justify-center">
                    <div className="size-2 bg-black rounded-2xs" />
                  </div>
                  <div className="col-span-2 row-start-5 row-span-2 bg-white border-2 border-black rounded-xs flex items-center justify-center">
                    <div className="size-2 bg-black rounded-2xs" />
                  </div>
                  <div className="col-start-3 col-span-2 row-start-3 row-span-2 bg-[#8F0028] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-black text-[#D4AF37]">RM</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center w-full">
                <span className="text-[10px] font-bold text-gray-700 tracking-wider uppercase flex items-center justify-center gap-1">
                  <QrCode className="size-3 text-[#8F0028]" />
                  <span>Dynamic Pass</span>
                </span>
                <p className="text-[8px] text-gray-500 font-mono truncate w-full mt-0.5">
                  {card.qr_code_hash.substring(0, 28)}...
                </p>
              </div>
            </div>

            {/* Footer Verification Notice */}
            <div className="pt-2 border-t border-white/10 text-center">
              <p className="text-[11px] text-[#D4AF37] font-semibold flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                <span>Verified Ravenshaw University Credential</span>
              </p>
              <p className="text-[9px] text-white/60 mt-0.5">
                Do not share this QR code publicly. Scanned dynamically at campus entry.
              </p>
            </div>
          </div>
        </div>

        {/* Supporting Guidelines */}
        <Card className="mt-6 p-5 rounded-2xl bg-card border border-border/80 text-sm space-y-3 shadow-xs">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span>How to use your Digital ID</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
            <li>Present this digital card at campus entry points when requested.</li>
            <li>Use the dynamic QR code for library self-checkout and event check-ins.</li>
            <li>Your ID is linked to your official profile and updates automatically upon graduation or promotion.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}

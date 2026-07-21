import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";
import { AlumniProfileHero } from "./AlumniProfileHero";
import { AlumniOwnerActions } from "./AlumniOwnerActions";
import { AlumniClaimPanel } from "./AlumniClaimPanel";
import { AlumniJourney } from "./AlumniJourney";
import { AlumniDepartment } from "./AlumniDepartment";
import { AlumniHostel } from "./AlumniHostel";
import { AlumniOrganizations } from "./AlumniOrganizations";
import { AlumniLeadership } from "./AlumniLeadership";
import { AlumniStory } from "./AlumniStory";
import { AlumniProfessionalJourney } from "./AlumniProfessionalJourney";
import { AlumniAchievements } from "./AlumniAchievements";
import { AlumniMemories } from "./AlumniMemories";
import { AlumniGallery } from "./AlumniGallery";
import { AlumniEvents } from "./AlumniEvents";
import { AlumniCompetitions } from "./AlumniCompetitions";
import { AlumniCertificates } from "./AlumniCertificates";
import { AlumniContributions } from "./AlumniContributions";
import { AlumniConnections } from "./AlumniConnections";
import { AlumniSocialLinks } from "./AlumniSocialLinks";
import { AlumniProfileShare } from "./AlumniProfileShare";
import { RelatedAlumni } from "./RelatedAlumni";
import { AlumniProfilePrivacyNotice } from "./AlumniProfilePrivacyNotice";

interface AlumniProfileViewProps {
  alumnus: PublicAlumniProfile;
  allAlumni: PublicAlumniProfile[];
  isOwner?: boolean;
}

export const AlumniProfileView: React.FC<AlumniProfileViewProps> = ({
  alumnus,
  allAlumni,
  isOwner = false,
}) => {
  return (
    <div className="min-h-screen bg-[var(--color-rm-background)] text-white pb-16">
      {/* 1. Hero Section */}
      <AlumniProfileHero alumnus={alumnus} />

      {/* 2. Owner Actions (when authenticated user is owner) */}
      <AlumniOwnerActions isOwner={isOwner} />

      {/* 3. Claim Panel (when claimable and not owner) */}
      <AlumniClaimPanel isOwner={isOwner} isClaimable={alumnus.isClaimable} />

      {/* 4. My Ravenshaw Journey */}
      <AlumniJourney alumnus={alumnus} />

      {/* 5. Department Connection */}
      <AlumniDepartment alumnus={alumnus} />

      {/* 6. Hostel Connection */}
      <AlumniHostel alumnus={alumnus} />

      {/* 7. Organizations and Communities */}
      <AlumniOrganizations alumnus={alumnus} />

      {/* 8. Leadership and Service (CR & BMC legacy) */}
      <AlumniLeadership alumnus={alumnus} />

      {/* 9. My Ravenshaw Story (Biography) */}
      <AlumniStory alumnus={alumnus} />

      {/* 10. Beyond Ravenshaw (Professional Journey) */}
      <AlumniProfessionalJourney alumnus={alumnus} />

      {/* 11. Achievements & Recognition */}
      <AlumniAchievements achievements={alumnus.achievements} />

      {/* 12. Memories Shared */}
      <AlumniMemories memories={alumnus.memories} />

      {/* 13. My Ravenshaw Gallery */}
      <AlumniGallery galleryItems={alumnus.galleryItems} />

      {/* 14. Events and Campus Moments */}
      <AlumniEvents events={alumnus.events} />

      {/* 15. Competitions and Participation */}
      <AlumniCompetitions competitions={alumnus.competitions} />

      {/* 16. Certificates & Recognition */}
      <AlumniCertificates certificates={alumnus.certificates} />

      {/* 17. Contributions to the Community */}
      <AlumniContributions
        memoriesCount={Array.isArray(alumnus.memories) ? alumnus.memories.length : 0}
        galleryCount={Array.isArray(alumnus.galleryItems) ? alumnus.galleryItems.length : 0}
        achievementsCount={Array.isArray(alumnus.achievements) ? alumnus.achievements.length : 0}
        certificatesCount={Array.isArray(alumnus.certificates) ? alumnus.certificates.length : 0}
      />

      {/* 18. Ravenshaw Connections */}
      <AlumniConnections
        currentProfileSlug={alumnus.slug}
        batch={alumnus.batch}
        departmentName={alumnus.departmentName}
        allAlumni={allAlumni}
      />

      {/* 19. Social Links (Safe public channels only) */}
      <AlumniSocialLinks alumnus={alumnus} />

      {/* 20. Share This Alumni Profile */}
      <AlumniProfileShare
        fullName={alumnus.publicDisplayName || alumnus.fullName}
        slug={alumnus.slug}
      />

      {/* 21. Profile Privacy Notice */}
      <AlumniProfilePrivacyNotice />

      {/* 22. Related Alumni (More Ravenshaw Journeys) */}
      <RelatedAlumni
        currentProfileSlug={alumnus.slug}
        departmentName={alumnus.departmentName}
        batch={alumnus.batch}
        allAlumni={allAlumni}
      />

      {/* 23. Bottom Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/alumni"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-rm-gold)] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Alumni Directory</span>
        </Link>
      </div>
    </div>
  );
};

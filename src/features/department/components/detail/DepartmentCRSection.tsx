"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Phone, Calendar, ShieldCheck, Instagram, Linkedin, MessageSquare, ArrowUpRight } from "lucide-react";
import { DepartmentCRMock } from "../../data/mock-department-detail";

export interface DepartmentCRSectionProps {
  currentCR: DepartmentCRMock;
  departmentName: string;
}

export const DepartmentCRSection: React.FC<DepartmentCRSectionProps> = ({
  currentCR,
  departmentName,
}) => {
  return (
    <section id="cr" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-[#D4AF37] rounded-full" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B1C] tracking-tight font-serif">
              Current Department CR
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4446]">
            Elected student representative coordinating academic schedules, student welfare, and departmental events.
          </p>
        </div>
        <span className="text-xs font-semibold bg-[#D4AF37]/20 text-[#1E1B1C] px-3.5 py-1.5 rounded-full self-start sm:self-auto border border-[#D4AF37]/40 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#5B001B]" />
          Verified Representative
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Highlighted CR Luxury Card (Apple + Notion Dashboard style) */}
        <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-[#FFFDF8] via-[#FDFBF7] to-[#F3ECE1] border-2 border-[#D4AF37]/60 shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 relative z-10">
            {/* Large Avatar Photo */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#5B001B] border-2 border-[#D4AF37] shadow-xl shrink-0 flex items-center justify-center text-3xl font-black text-[#D4AF37] overflow-hidden">
              {currentCR.avatarUrl ? (
                <Image
                  src={currentCR.avatarUrl}
                  alt={currentCR.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span>{currentCR.name.replace(/[^A-Z]/g, "").slice(0, 2)}</span>
              )}
            </div>

            {/* CR Info & Term */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#5B001B] text-white shadow-sm">
                  Class Representative
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#D4AF37]/30 text-[#1E1B1C] flex items-center gap-1.5 border border-[#D4AF37]/50">
                  <Calendar className="w-3.5 h-3.5 text-[#5B001B]" />
                  Term / Session: {currentCR.session}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B1C]">
                  {currentCR.name}
                </h3>
                <span title="Verified CR">
                  <CheckCircle2 className="w-6 h-6 text-[#5B001B] fill-[#D4AF37] shrink-0" />
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-[#5B001B]">
                {currentCR.role} • <span className="text-[#4A4446]">Batch {currentCR.batch}</span>
              </p>

              {/* Social Links Row */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-[#7A7476]">Social &amp; Contact:</span>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-[#EADED2] flex items-center justify-center text-[#E1306C] hover:scale-110 transition-transform shadow-2xs" aria-label="CR Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-[#EADED2] flex items-center justify-center text-[#0A66C2] hover:scale-110 transition-transform shadow-2xs" aria-label="CR LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={`mailto:${currentCR.email}`} className="w-8 h-8 rounded-full bg-white border border-[#EADED2] flex items-center justify-center text-[#5B001B] hover:scale-110 transition-transform shadow-2xs" aria-label="CR Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={`mailto:${currentCR.email}`}
                  className="px-6 py-3 rounded-full bg-[#5B001B] hover:bg-[#720022] text-white text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-md flex items-center gap-2 hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Message to CR</span>
                </a>
                <a
                  href={`tel:${currentCR.phone}`}
                  className="px-5 py-3 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1E1B1C] border border-[#EADED2] text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm flex items-center gap-2 hover:scale-105"
                >
                  <Phone className="w-4 h-4 text-[#5B001B]" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Box: Representative Charter & Quick FAQs */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-white border border-[#EADED2] shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#1E1B1C] flex items-center gap-2 border-b border-[#EADED2] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#5B001B]" />
            CR Office Responsibilities
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#4A4446] leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#5B001B] mt-1.5 shrink-0" />
              <span>Coordinating seminar timetables, practical batches, and faculty communications.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#5B001B] mt-1.5 shrink-0" />
              <span>Leading annual departmental cultural fests, farewells, and freshers orientations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#5B001B] mt-1.5 shrink-0" />
              <span>Facilitating student feedback and maintaining official department digital archives.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

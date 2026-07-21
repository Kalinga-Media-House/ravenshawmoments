"use client";

import React from "react";
import { ShieldCheck, School, AlertCircle } from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import { ParticipantOrigin as OriginType } from "../../types/registration";

export interface ParticipantOriginProps {
  competition: CompetitionItem;
  value: OriginType;
  onChange: (value: OriginType) => void;
}

export const ParticipantOriginSelector: React.FC<ParticipantOriginProps> = ({
  competition,
  value,
  onChange,
}) => {
  const allowExternal = competition.externalParticipantsAllowed === true;

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-extrabold text-[var(--color-rm-gold)] uppercase tracking-wider block mb-2">
        1. Participant Origin
      </legend>

      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-black text-white">
          Are you a Ravenshawvian?
        </h3>
        <p className="text-xs sm:text-sm text-white/70">
          Select your institutional connection to verify your competition eligibility.
        </p>
      </div>

      <div
        className={`grid grid-cols-1 ${allowExternal ? "sm:grid-cols-2" : ""} gap-4 pt-2`}
      >
        {/* Ravenshaw Option */}
        <label
          className={`relative flex items-start gap-3.5 p-5 rounded-2xl border cursor-pointer transition-all ${
            value === "Ravenshawvian"
              ? "bg-[var(--color-rm-maroon)]/60 border-[var(--color-rm-gold)] shadow-xl"
              : "bg-white/5 border-white/15 hover:border-white/30"
          }`}
        >
          <input
            type="radio"
            name="participantOrigin"
            value="Ravenshawvian"
            checked={value === "Ravenshawvian"}
            onChange={() => onChange("Ravenshawvian")}
            className="mt-1 w-4 h-4 accent-[var(--color-rm-gold)]"
          />
          <div className="space-y-1">
            <span className="text-sm font-extrabold text-white block">
              Yes, I am a Ravenshawvian
            </span>
            <span className="text-xs text-white/75 block leading-relaxed">
              Enrolled student, faculty member, or registered alumnus of Ravenshaw University.
            </span>
          </div>
        </label>

        {/* External Option (Only when externalParticipantsAllowed is true) */}
        {allowExternal && (
          <label
            className={`relative flex items-start gap-3.5 p-5 rounded-2xl border cursor-pointer transition-all ${
              value === "External"
                ? "bg-[var(--color-rm-maroon)]/60 border-[var(--color-rm-gold)] shadow-xl"
                : "bg-white/5 border-white/15 hover:border-white/30"
            }`}
          >
            <input
              type="radio"
              name="participantOrigin"
              value="External"
              checked={value === "External"}
              onChange={() => onChange("External")}
              className="mt-1 w-4 h-4 accent-[var(--color-rm-gold)]"
            />
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-white block">
                I study at another college or university
              </span>
              <span className="text-xs text-white/75 block leading-relaxed">
                External participant participating under inter-collegiate or open competition
                guidelines.
              </span>
            </div>
          </label>
        )}
      </div>

      {!allowExternal && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-white/80">
          <AlertCircle
            className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <strong className="text-white block font-bold">
              Institutional Eligibility Notice
            </strong>
            <span>
              This competition is currently open only to eligible Ravenshaw participants.
            </span>
          </div>
        </div>
      )}
    </fieldset>
  );
};

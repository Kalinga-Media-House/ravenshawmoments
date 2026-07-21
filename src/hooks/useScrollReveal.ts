"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
  selector?: string;
}

export function useScrollReveal({
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  staggerDelay = 50,
  selector = ".rm-reveal",
}: ScrollRevealOptions = {}) {
  const containerRef = useRef<HTMLElement | HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = containerRef.current?.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        el.classList.add("rm-reveal-active");
        el.classList.remove("rm-reveal-init");
      });
      return;
    }

    // Attach initial hidden state for progressive enhancement
    elements.forEach((el) => {
      if (!el.classList.contains("rm-reveal-active")) {
        el.classList.add("rm-reveal-init");
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        
        intersecting.forEach((entry, index) => {
          setTimeout(() => {
            entry.target.classList.add("rm-reveal-active");
            entry.target.classList.remove("rm-reveal-init");
          }, index * staggerDelay);
          
          // Only animate once per section/card
          obs.unobserve(entry.target);
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [threshold, rootMargin, staggerDelay, selector]);

  return containerRef;
}

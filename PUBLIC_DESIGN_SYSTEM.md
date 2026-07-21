# Ravenshaw Moments - Public Design System

This document outlines the standard design tokens, architecture, and utility classes for the **Dark Heritage Theme** applied across all public-facing pages of the Ravenshaw Moments application. 

This theme is the **default design system** for all public pages (`/app/(public)/*`). It aims to deliver a premium, academic, and modern experience using dark tones and "glass" effects.

---

## 1. Core Philosophy
The public website uses a premium dark heritage experience characterised by:
- Deep Ravenshaw maroon & burgundy
- Warm heritage gold accents
- Soft ivory text
- Transparent glass surfaces (glassmorphism)
- Subtle background glow and refined borders
- Smooth reveal animations on scroll

**Strict Constraint**: The public-facing site strictly avoids bright white (`bg-white`) and cream (`bg-[#FCFBFA]`) block backgrounds. Ensure the primary background remains dark.

---

## 2. CSS Custom Properties (Tokens)

All theme tokens are defined in `src/styles/globals.css`. Always use these CSS variables instead of hardcoding hex colors or opacities.

### Background Colors
- `var(--color-rm-bg-deep)`: `#1A0A0E` (Deepest maroon/black base)
- `var(--color-rm-bg-card)`: `rgba(26, 10, 14, 0.6)` (Default background for cards)

### Accent Colors
- `var(--color-rm-accent)`: `#8A1538` (Signature Ravenshaw maroon)
- `var(--color-rm-accent-dark)`: `#5C0D24`
- `var(--color-rm-gold)`: `#D9A441` (Heritage gold)
- `var(--color-rm-gold-soft)`: `#E8C581`

### Text Colors
- `var(--color-rm-text-primary)`: `#FDFBF7` (Soft ivory for primary text/headings)
- `var(--color-rm-text-muted)`: `rgba(253, 251, 247, 0.7)` (Muted text for descriptions)

### Glass UI Borders
- `var(--color-rm-glass-border)`: `rgba(217, 164, 65, 0.15)` (Subtle gold border for glass elements)
- `var(--color-rm-glass-border-hover)`: `rgba(217, 164, 65, 0.3)`

---

## 3. Standard Utility Classes

To maintain consistency and reduce repetitive styling, use the following `rm-*` standard utility classes.

### 3.1. Glass UI Elements

**`.rm-glass-card`**
Use this for all section cards, highlight boxes, and standard containers.
- Implements the blurred backdrop (`backdrop-filter: blur(12px)`).
- Sets the standard background and border using theme variables.

**`.rm-glass-input`**
Use this for standard forms, inputs, and textareas on public pages.
- Matches the card styling but optimized for interactive input fields.
- Provides consistent focus states (`focus-visible:border-[var(--color-rm-gold)]`).

### 3.2. Typography

**`.rm-heading-primary`**
Use for standard headings (H1, H2, H3).
- Uses `var(--color-rm-text-primary)`.

**`.rm-text-body`**
Use for standard body text and paragraphs.
- Uses `var(--color-rm-text-muted)`.

### 3.3. Reveal Animations

Instead of using heavy libraries like `framer-motion` for basic scroll entrances, the public pages use a custom, lightweight CSS-driven solution via `IntersectionObserver`.

**Implementation Steps:**
1. Import `useScrollReveal` hook: `import { useScrollReveal } from "@/hooks/useScrollReveal";`
2. Add the ref to the parent container: `<section ref={revealRef}>`
3. Add the `.rm-reveal` class to child elements that should animate in: `<div className="rm-reveal">`

*Elements with `.rm-reveal` will automatically fade and slide up as they enter the viewport.*

---

## 4. Implementation Example

```tsx
"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function StandardSection() {
  const revealRef = useScrollReveal();

  return (
    <section className="py-20 relative overflow-hidden" ref={revealRef as React.RefObject<HTMLDivElement>}>
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-rm-accent)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Animated Header */}
        <div className="rm-reveal text-center mb-16">
          <h2 className="text-4xl font-bold rm-heading-primary mb-4">Our Heritage</h2>
          <p className="rm-text-body max-w-2xl mx-auto">Discover the rich history.</p>
        </div>
        
        {/* Grid of Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Card 1 */}
           <div className="rm-reveal" style={{ transitionDelay: '100ms' }}>
             <div className="rm-glass-card p-8 rounded-2xl h-full flex flex-col items-center">
               <h3 className="rm-heading-primary text-2xl font-bold mb-4">Item Title</h3>
               <p className="rm-text-body text-center">Description of the item goes here.</p>
             </div>
           </div>
           
           {/* Card 2 */}
           <div className="rm-reveal" style={{ transitionDelay: '200ms' }}>
             {/* ... */}
           </div>
        </div>
      </div>
    </section>
  );
}
```

## 5. Migration Checklist for Future Pages
When building new pages in `/app/(public)/`:
- [ ] Ensure the background inherits the dark theme (avoid setting `bg-white`).
- [ ] Use `rm-glass-card` instead of hardcoded white backgrounds (`bg-white`) for containers.
- [ ] Replace `text-gray-900` or `text-black` with `rm-heading-primary` (for headings) or `text-[var(--color-rm-text-primary)]`.
- [ ] Replace `text-gray-500` or `text-gray-600` with `rm-text-body` or `text-[var(--color-rm-text-muted)]`.
- [ ] Add `.rm-reveal` and use the `useScrollReveal` hook instead of `framer-motion` where possible for simple entrances.
- [ ] Use `[var(--color-rm-gold)]` for accents, focus rings, and primary interactive highlights.

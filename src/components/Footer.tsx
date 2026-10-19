import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { SOCIAL_LINKS } from '../data/mockData';
import { LaserCollection } from '../shaders/laser/LaserCollection';
import '../shaders/threeui.css';

const socialItems = [
  { label: 'aDOPE Club', href: SOCIAL_LINKS.behance, external: true },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, external: true },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, external: true },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube, external: true },
];

export const Footer: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer
      className="relative z-20 w-full overflow-hidden border-t border-white/10 bg-black"
    >
      {/* Laser background */}
      <LaserCollection
        variant="matrix-field"
        speed={1}
        size={1}
        length={1.46}
        density={1}
        opacity={1}
        hue={-12}
        saturation={1}
        brightness={0.67}
        className="!absolute inset-0 h-full w-full"
      />
      {/* Gradient overlay to keep footer text readable */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.85),rgba(0,0,0,.5)_50%,rgba(0,0,0,.82))]" />

      <div className="relative z-10 mx-auto grid max-w-[1440px] gap-10 px-4 py-9 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_.8fr] md:items-end md:px-16 md:py-16">
        <div>
          <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500">Mahatma Gandhi Institute of Technology · Hyderabad</span>
          <h2 className="font-heading text-4xl font-extrabold uppercase leading-[0.88] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">
            aDOPE<br />CLUB<span className="text-neutral-600">.</span>
          </h2>
          <p className="mt-5 max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-neutral-500">A DOPE CLUB OF MGIT</p>
        </div>

        <div className="flex flex-col gap-7 md:items-end">
          <nav aria-label="Social links">
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {socialItems.map(({ label, href, external }) => (
                <li key={label}>
                  <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group inline-flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:border-white hover:bg-white hover:text-black">
                    {label}<ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex w-full items-center justify-between gap-5 border-t border-white/10 pt-4 md:justify-end md:gap-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600">©2026 aDOPE CLUB · MGIT DESIGN CLUB</span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })} className="group inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:text-white">
              Back to top<span className="grid h-8 w-8 place-items-center border border-white/20 transition-all group-hover:-translate-y-1 group-hover:border-white group-hover:bg-white group-hover:text-black"><ArrowUp className="h-3.5 w-3.5" /></span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

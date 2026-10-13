import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SOCIAL_LINKS } from '../data/mockData';

const socialItems = [
  { label: 'aDOPE Club', href: SOCIAL_LINKS.behance },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, external: true },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, external: true },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube, external: true },
];

export const Footer: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 w-full overflow-hidden border-t border-white/10 bg-[#0E0E0E]"
    >
      <div className="overflow-hidden border-b border-white/10 py-4 sm:py-6" aria-hidden="true">
        <motion.div
          className="flex w-max items-center whitespace-nowrap"
          animate={prefersReducedMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={prefersReducedMotion ? undefined : { duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center gap-5 pr-5 text-[clamp(2.2rem,7vw,6.5rem)] font-black uppercase leading-none tracking-[-0.065em] text-white sm:gap-8 sm:pr-8">
              <span>MAKE GOOD THINGS</span>
              <span className="text-neutral-600">✳</span>
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.72)]">MAKE GOOD TROUBLE</span>
              <span className="text-neutral-600">✳</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-9 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_.8fr] md:items-end md:px-16 md:py-16">
        <div>
          <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500">Mahatma Gandhi Institute of Technology · Hyderabad</span>
          <div className="text-4xl font-extrabold uppercase leading-[0.88] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">ADOPE<br />CLUB<span className="text-neutral-600">.</span></div>
          <p className="mt-5 max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-neutral-500">A student-led design community turning ideas into identity, experience and culture.</p>
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
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600">©2026 ADOPE CLUB · MGIT DESIGN CLUB</span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })} className="group inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:text-white">
              Back to top<span className="grid h-8 w-8 place-items-center border border-white/20 transition-all group-hover:-translate-y-1 group-hover:border-white group-hover:bg-white group-hover:text-black"><ArrowUp className="h-3.5 w-3.5" /></span>
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { SOCIAL_LINKS } from '../data/mockData';

const socialItems = [
  { label: 'aDOPE Club', href: SOCIAL_LINKS.behance },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, external: true },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, external: true },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube, external: true },
];

const letterReveal: Variants = {
  hidden: { opacity: 0, y: '115%', rotateX: -70 },
  visible: { opacity: 1, y: '0%', rotateX: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

export const Footer: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const reveal: Variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0 } } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.12, delayChildren: 0.08 } } };
  const itemReveal: Variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0 } } }
    : { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.08 } } };
  const logoReveal: Variants = prefersReducedMotion
    ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } };
  const glyphReveal: Variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0, rotateX: 0 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0 } } }
    : letterReveal;

  return (
    <motion.footer
      variants={reveal}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="relative z-20 w-full overflow-hidden border-t border-white/10 bg-[#0E0E0E]"
    >
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: prefersReducedMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-white/70 via-white/20 to-transparent"
      />

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-9 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_.8fr] md:items-end md:px-16 md:py-16">
        <motion.div variants={itemReveal}>
          <motion.span variants={itemReveal} className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500">Mahatma Gandhi Institute of Technology · Hyderabad</motion.span>
          <div className="mb-5 flex items-center gap-3 sm:gap-6">
            <motion.h2 aria-label="aDOPE Club" variants={logoReveal} className="min-w-0 perspective-[500px] text-4xl font-extrabold uppercase leading-[0.88] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">
              {['ADOPE', 'CLUB.'].map((row) => (
                <span key={row} aria-hidden="true" className="block overflow-hidden whitespace-nowrap pb-1">
                  {Array.from(row).map((character, index) => (
                    <motion.span key={`${row}-${index}`} variants={glyphReveal} className={`inline-block ${character === '.' ? 'text-neutral-600' : ''}`}>
                      {character}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h2>

          </div>
          <motion.p variants={itemReveal} className="mt-5 max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-neutral-500">A student-led design community turning ideas into identity, experience and culture.</motion.p>
        </motion.div>

        <motion.div variants={itemReveal} className="flex flex-col gap-7 md:items-end">
          <nav aria-label="Social links">
            <motion.ul variants={itemReveal} className="flex flex-wrap gap-2 md:justify-end">
              {socialItems.map(({ label, href, external }) => (
                <motion.li key={label} variants={itemReveal}>
                  <motion.a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} whileHover={prefersReducedMotion ? undefined : { y: -3 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }} className="group inline-flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:border-white hover:bg-white hover:text-black">
                    {label}<ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          <div className="flex w-full items-center justify-between gap-5 border-t border-white/10 pt-4 md:justify-end md:gap-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600">©2026 ADOPE CLUB · MGIT DESIGN CLUB</span>
            <motion.button type="button" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })} whileHover={prefersReducedMotion ? undefined : { y: -2 }} className="group inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:text-white">
              Back to top<span className="grid h-8 w-8 place-items-center border border-white/20 transition-all group-hover:-translate-y-1 group-hover:border-white group-hover:bg-white group-hover:text-black"><ArrowUp className="h-3.5 w-3.5" /></span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

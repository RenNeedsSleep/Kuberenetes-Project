import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const JOIN_FORM_URL = 'https://forms.gle/HYMR5CyABFc13pSK8';

export const EventsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || localStorage.getItem('adope-events-seen') === 'true') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
      localStorage.setItem('adope-events-seen', 'true');
      window.dispatchEvent(new Event('adope:events-seen'));
      observer.disconnect();
    }, { threshold: [0.55] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="events" className="relative overflow-hidden border-y border-amber-200/25 bg-[#100b08] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,164,74,.18),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 md:grid-cols-[.9fr_1.1fr] md:items-center md:px-16">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.25em] text-amber-200/75"><Sparkles size={13} /> Events & Announcements</span>
          <h2 className="section-heading text-balance font-extrabold uppercase leading-none tracking-tight text-white">Your next<br /><span className="text-amber-200">creative chapter</span></h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">aDOPE is looking for designers, illustrators, editors, motion artists, and makers. Explore the open call and find where you fit.</p>
          <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-3 border border-amber-200/70 bg-amber-200 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white">Respond to the open call <ArrowUpRight size={15} /></a>
        </div>
        <a href="/poster-open-auditions.webp" target="_blank" rel="noopener noreferrer" aria-label="Open the aDOPE auditions poster" className="group block overflow-hidden border border-amber-100/30 bg-black shadow-[0_20px_80px_rgba(0,0,0,.55)]">
          <img src="/poster-open-auditions.webp" alt="aDOPE presents DISEGNO open call for creative roles" className="max-h-[78vh] w-full object-contain transition duration-500 group-hover:scale-[1.015]" />
        </a>
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const JOIN_FORM_URL = 'https://forms.gle/KHvuQ3bNp7cEXJ258';
const ANNOUNCEMENTS = ['disegno-open-call-2026'];
const SEEN_KEY = 'adope-seen-announcements';

const getSeenAnnouncements = (): string[] => {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]') as string[]; }
  catch { return []; }
};

export const EventsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || ANNOUNCEMENTS.every((id) => getSeenAnnouncements().includes(id))) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
      const seen = new Set(getSeenAnnouncements());
      ANNOUNCEMENTS.forEach((id) => seen.add(id));
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
      localStorage.setItem('adope-events-seen', 'true');
      window.dispatchEvent(new Event('adope:events-seen'));
      observer.disconnect();
    }, { threshold: [0.55] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="events" className="relative overflow-hidden border-y border-amber-200/35 bg-[#100b08] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,164,74,.18),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 md:grid-cols-[.9fr_1.1fr] md:items-center md:px-16">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.25em] text-amber-200/75"><Sparkles size={13} /> Events & Announcements</span>
          <h2 className="section-heading text-balance font-extrabold uppercase leading-none tracking-tight text-white">Your next<br /><span className="text-amber-200">creative chapter</span></h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">aDOPE is looking for designers, illustrators, editors, motion artists, and makers. Explore the open call and find where you fit.</p>
          <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-3 border border-amber-200/70 bg-amber-200 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white">Respond to the open call <ArrowUpRight size={15} /></a>
        </div>
        <div className="relative border border-amber-200/45 bg-black p-2 shadow-[0_20px_80px_rgba(0,0,0,.55),0_0_32px_rgba(196,145,55,.12)] sm:p-3">
          <div className="mb-2 flex items-center justify-between border-b border-amber-200/20 px-2 pb-2 font-mono text-[9px] uppercase tracking-[.22em] text-amber-100/75">
            <span>Announcement 01 / Open Call</span><span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" /> New</span>
          </div>
          <a href="/poster-open-auditions-qr.png" target="_blank" rel="noopener noreferrer" aria-label="Open the aDOPE auditions poster" className="group block overflow-hidden bg-black">
            <img src="/poster-open-auditions-qr.png" alt="aDOPE presents DISEGNO open call for creative roles" className="max-h-[78vh] w-full object-contain transition duration-500 group-hover:scale-[1.015]" />
          </a>
        </div>
      </div>
    </section>
  );
};

import React, { useLayoutEffect, useRef, useState } from 'react';
import { ARTISTS_DATA } from '../data/mockData';
import { Artist } from '../types';
import { ChevronLeft, ChevronRight, Instagram, Linkedin, Github } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';

interface ArtistsSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxTravel, setMaxTravel] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const horizontalX = useSpring(useTransform(scrollYProgress, [0, 1], [0, -maxTravel]), { stiffness: 110, damping: 30, mass: 0.34 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => setMaxTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));
    measure();
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(horizontalX, 'change', (value) => {
    const nextProgress = maxTravel ? Math.min(1, Math.max(0, Math.abs(value) / maxTravel)) : 0;
    setProgress(nextProgress);
    const nextIndex = Math.min(ARTISTS_DATA.length - 1, Math.round(nextProgress * (ARTISTS_DATA.length - 1)));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  const goToSlide = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollSpan = Math.max(0, section.offsetHeight - window.innerHeight);
    const target = section.getBoundingClientRect().top + window.scrollY + scrollSpan * (index / Math.max(1, ARTISTS_DATA.length - 1));
    window.scrollTo({ top: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const move = (direction: -1 | 1) => goToSlide(Math.max(0, Math.min(ARTISTS_DATA.length - 1, activeIndex + direction)));

  return (
    <section
      ref={sectionRef}
      id="artists"
      className="relative z-20 border-b border-white/10 bg-[#0E0E0E]"
      style={{ height: `calc(100svh + ${maxTravel}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-5 sm:py-8">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-16">
          <div className="mb-6 flex items-end justify-between gap-5 sm:mb-8 sm:gap-8">
            <div>
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-neutral-400 sm:mb-3 sm:text-xs">02 // PRACTICE · SCROLL TO EXPLORE</span>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">Areas of Practice</h2>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Previous practice area" className="grid h-11 w-11 place-items-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => move(1)} disabled={activeIndex === ARTISTS_DATA.length - 1} aria-label="Next practice area" className="grid h-11 w-11 place-items-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>

          <div ref={viewportRef} className="-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-16 lg:px-16">
            <motion.div
              ref={trackRef}
              style={{ x: horizontalX }}
              role="region"
              aria-label="aDOPE areas of practice carousel"
              aria-roledescription="carousel"
              className="flex w-max gap-4 pb-2 sm:gap-5 lg:gap-6"
            >
              {ARTISTS_DATA.map((artist: Artist, index) => {
                const imageId = `artist-${artist.id}`;
                const isHighlighted = highlightedImageId === imageId;
                return (
                  <article
                    key={artist.id}
                    aria-label={`${index + 1} of ${ARTISTS_DATA.length}: ${artist.name}`}
                    onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(imageId)}
                    onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(imageId)}
                    onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(imageId)}
                    className="group relative grid h-[min(66svh,560px)] min-h-[430px] w-[82vw] max-w-[560px] shrink-0 grid-rows-[0.82fr_1.18fr] overflow-hidden border border-white/10 bg-[#171717] p-3 transition-colors duration-300 hover:border-white/40 sm:h-[min(60svh,500px)] sm:min-h-[390px] sm:w-[74vw] sm:grid-cols-[0.9fr_1.1fr] sm:grid-rows-1 sm:p-4 lg:w-[42vw] lg:max-w-[640px] lg:p-5"
                  >
                    <div className="group/image relative min-h-0 overflow-hidden bg-[#0E0E0E]">
                      <img src={artist.avatarUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover/image:scale-[1.04]" style={{ filter: isHighlighted ? 'none' : 'grayscale(1)', transform: isHighlighted ? 'scale(1.04)' : undefined, opacity: isHighlighted ? 1 : 0.76 }} />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/25" />
                      <span className="absolute left-3 top-3 border border-white/20 bg-black/45 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">{String(index + 1).padStart(2, '0')} / {artist.role}</span>
                    </div>
                    <div className="flex min-h-0 flex-col justify-between gap-3 px-1 py-3 sm:px-4 sm:py-2 lg:px-5">
                      <div>
                        <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Practice area {String(index + 1).padStart(2, '0')}</span>
                        <h3 className="mb-2 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">{artist.name}</h3>
                        <p className="max-w-[38ch] text-[12px] leading-relaxed text-neutral-400 sm:text-sm">{artist.bio}</p>
                      </div>
                      <div>
                        <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4">
                          {artist.specialty.map((spec) => <span key={spec} className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] text-neutral-300 sm:text-[9px]">{spec}</span>)}
                        </div>
                        {(artist.instagramUrl || artist.linkedinUrl || artist.githubUrl) && <div className="flex items-center gap-3 border-t border-white/10 pt-3 text-neutral-400">
                          {artist.instagramUrl && <a href={artist.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-white" title="Instagram"><Instagram className="h-4 w-4" /></a>}
                          {artist.linkedinUrl && <a href={artist.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-white" title="LinkedIn"><Linkedin className="h-4 w-4" /></a>}
                          {artist.githubUrl && <a href={artist.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-white" title="GitHub"><Github className="h-4 w-4" /></a>}
                        </div>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </div>

          <div className="mt-3 flex items-center gap-5 sm:mt-4">
            <div className="relative h-5 flex-1" role="progressbar" aria-label="Areas of practice scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/20" />
              <motion.div className="absolute left-0 top-1/2 h-px origin-left bg-white" style={{ scaleX: scrollYProgress }} />
              {ARTISTS_DATA.map((artist, index) => <button key={artist.id} type="button" onClick={() => goToSlide(index)} aria-label={`Show ${artist.name}`} aria-current={activeIndex === index ? 'step' : undefined} className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors ${activeIndex === index ? 'border-white bg-white' : 'border-white/40 bg-[#0E0E0E] hover:border-white'}`} style={{ left: `${ARTISTS_DATA.length === 1 ? 0 : (index / (ARTISTS_DATA.length - 1)) * 100}%` }} />)}
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">{String(activeIndex + 1).padStart(2, '0')} / {String(ARTISTS_DATA.length).padStart(2, '0')}</span>
          </div>
          <p className="mt-1 text-right font-mono text-[8px] uppercase tracking-[0.15em] text-neutral-600 sm:hidden">Keep scrolling · the work moves with you</p>
        </div>
      </div>
    </section>
  );
};

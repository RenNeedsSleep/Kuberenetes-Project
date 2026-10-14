import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ARTISTS_DATA } from '../data/mockData';
import { Artist } from '../types';

interface ArtistsSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

interface PracticeCardProps {
  artist: Artist;
  index: number;
  progress: MotionValue<number>;
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ artist, index, progress, highlightedImageId, onImageEnter, onImageLeave }) => {
  const reduceMotion = useReducedMotion();
  const imageId = `artist-${artist.id}`;
  const isHighlighted = highlightedImageId === imageId;
  const count = ARTISTS_DATA.length;
  const enterStart = index === 0 ? 0 : Math.max(0, (index - 0.72) / count);
  const enterEnd = index === 0 ? 0.16 : Math.min(0.91, (index + 0.1) / count);
  const exitStart = Math.min(0.98, Math.max(enterEnd + 0.05, (index + 1.85) / count));
  const entryX = index % 2 ? '16vw' : '-16vw';
  const entryRotate = index % 2 ? 4 : -4;
  const cardX = useTransform(progress, [enterStart, enterEnd, exitStart, 1], [entryX, '0vw', index % 2 ? '-2vw' : '2vw', index % 2 ? '-4vw' : '4vw']);
  const cardY = useTransform(progress, [enterStart, enterEnd, exitStart, 1], [index === 0 ? '0vh' : '104vh', '0vh', '-2vh', '-9vh']);
  const cardScale = useTransform(progress, [enterStart, enterEnd, exitStart, 1], [index === 0 ? 1 : 0.9, 1, 0.975, 0.93]);
  const cardRotate = useTransform(progress, [enterStart, enterEnd, exitStart, 1], [entryRotate, 0, index % 2 ? -1 : 1, index % 2 ? -2 : 2]);
  const imageScale = useTransform(progress, [enterStart, enterEnd, 1], [1.18, 1.045, 1.08]);
  const metaOpacity = useTransform(progress, [enterStart, enterEnd], [0, 1]);

  return (
    <motion.article
      aria-label={`${index + 1} of ${count}: ${artist.name}`}
      onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(imageId)}
      onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(imageId)}
      onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(imageId)}
      className="absolute inset-0 isolate overflow-hidden border border-white/20 bg-black shadow-[0_36px_90px_rgba(0,0,0,.46)]"
      style={reduceMotion ? { zIndex: index + 1 } : { x: cardX, y: cardY, scale: cardScale, rotate: cardRotate, zIndex: index + 1 }}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${artist.avatarUrl}')`,
          filter: isHighlighted ? 'none' : 'grayscale(1) contrast(1.09)',
          scale: reduceMotion ? 1.04 : imageScale,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.88)_0%,rgba(6,6,6,.32)_53%,rgba(5,5,5,.14)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.82)_0%,transparent_53%)]" />
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-5 sm:inset-x-7 sm:top-7 lg:inset-x-10 lg:top-9">
        <span className="border border-white/25 bg-black/35 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:text-[9px]">Practice / {String(index + 1).padStart(2, '0')}</span>
        <motion.span className="hidden max-w-[18ch] text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/55 sm:block" style={reduceMotion ? undefined : { opacity: metaOpacity }}>One discipline,<br />many directions.</motion.span>
      </div>

      <div className="absolute bottom-5 left-4 right-4 sm:bottom-8 sm:left-7 sm:right-7 lg:bottom-10 lg:left-10 lg:right-10">
        <motion.div style={reduceMotion ? undefined : { opacity: metaOpacity }}>
          <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/58 sm:text-[10px]">{artist.role}</span>
          <h3 className="max-w-[11ch] text-[clamp(2.7rem,7.8vw,8.5rem)] font-black uppercase leading-[0.76] tracking-[-0.09em] text-white">{artist.name}</h3>
        </motion.div>
        <motion.div className="mt-5 grid max-w-3xl gap-4 border-t border-white/25 pt-4 sm:mt-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:pt-5" style={reduceMotion ? undefined : { opacity: metaOpacity }}>
          <p className="max-w-[52ch] text-[11px] leading-relaxed text-white/74 sm:text-sm">{artist.bio}</p>
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {artist.specialty.map((spec) => <span key={spec} className="border border-white/20 bg-black/25 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/75 backdrop-blur-sm sm:text-[9px]">{spec}</span>)}
          </div>
        </motion.div>
      </div>
      <ArrowUpRight aria-hidden="true" className="absolute bottom-5 right-4 h-5 w-5 text-white/60 sm:bottom-8 sm:right-7 sm:h-6 sm:w-6 lg:bottom-10 lg:right-10" />
    </motion.article>
  );
};

/** A scroll-choreographed deck: each discipline arrives from a different vector, settles, then leaves a trace for the next. */
export const ArtistsSection: React.FC<ArtistsSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 86, damping: 25, mass: 0.36 });
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const height = `calc(100svh + ${(ARTISTS_DATA.length - 1) * 68}svh)`;

  return (
    <section ref={sectionRef} id="artists" className="relative z-20 bg-black" style={{ height }}>
      <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_13%,rgba(255,255,255,.1),transparent_29%),radial-gradient(ellipse_at_84%_83%,rgba(255,255,255,.06),transparent_26%)]" />
        <div className="absolute inset-x-4 top-5 z-30 flex items-end justify-between gap-5 sm:inset-x-6 sm:top-7 md:inset-x-16">
          <div>
            <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.21em] text-neutral-400 sm:text-[10px]">02 // Disciplines in motion</span>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.06em] text-white sm:text-4xl">Areas of Practice</h2>
          </div>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/50 sm:block">{String(ARTISTS_DATA.length).padStart(2, '0')} practices / continuous deck</span>
        </div>

        <div className="absolute inset-x-4 bottom-6 top-[8.8rem] sm:inset-x-6 sm:bottom-8 sm:top-[10.4rem] md:inset-x-16">
          {ARTISTS_DATA.map((artist, index) => (
            <PracticeCard key={artist.id} artist={artist} index={index} progress={progress} highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 h-px bg-white/20">
          <motion.span className="block h-px bg-white" style={reduceMotion ? { width: '100%' } : { width: progressWidth }} />
        </div>
      </div>
    </section>
  );
};

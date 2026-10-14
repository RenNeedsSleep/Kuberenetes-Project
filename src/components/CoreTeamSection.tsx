import React, { useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { CORE_TEAM_DATA } from '../data/mockData';
import { CoreTeamMember } from '../types';

interface CoreTeamSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

const CARD_ENTRANCES = [
  { x: '-18vw', y: '18vh', rotate: -9 },
  { x: '-8vw', y: '28vh', rotate: 6 },
  { x: '9vw', y: '24vh', rotate: -5 },
  { x: '19vw', y: '17vh', rotate: 8 },
  { x: '-20vw', y: '9vh', rotate: 7 },
  { x: '16vw', y: '11vh', rotate: -8 },
  { x: '5vw', y: '30vh', rotate: 4 },
];

interface TeamCardProps {
  member: CoreTeamMember;
  index: number;
  progress: MotionValue<number>;
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, index, progress, highlightedImageId, onImageEnter, onImageLeave }) => {
  const reduceMotion = useReducedMotion();
  const entry = CARD_ENTRANCES[index % CARD_ENTRANCES.length];
  const enterEnd = Math.min(0.68, 0.24 + index * 0.065);
  const cardX = useTransform(progress, [0, enterEnd, 1], [entry.x, '0vw', '0vw']);
  const cardY = useTransform(progress, [0, enterEnd, 1], [entry.y, '0vh', '0vh']);
  const cardRotate = useTransform(progress, [0, enterEnd, 1], [entry.rotate, 0, 0]);
  const cardScale = useTransform(progress, [0, enterEnd, 1], [0.62, 1, 1]);
  const cardOpacity = useTransform(progress, [0, Math.max(0.12, enterEnd - 0.14)], [0, 1]);
  const imageScale = useTransform(progress, [0, enterEnd, 1], [1.2, 1.04, 1]);
  const imageId = `team-${member.id}`;
  const isHighlighted = highlightedImageId === imageId;

  return (
    <motion.article
      onPointerEnter={() => window.matchMedia('(hover: hover)').matches && member.imageUrl && onImageEnter(imageId)}
      onPointerLeave={() => window.matchMedia('(hover: hover)').matches && member.imageUrl && onImageLeave(imageId)}
      onClick={() => window.matchMedia('(hover: none)').matches && member.imageUrl && onImageEnter(imageId)}
      className="group relative min-w-0 overflow-hidden border border-white/15 bg-black p-2.5 shadow-[0_20px_48px_rgba(0,0,0,.25)] sm:p-3"
      style={reduceMotion ? undefined : { x: cardX, y: cardY, rotate: cardRotate, scale: cardScale, opacity: cardOpacity }}
    >
      <div className="absolute left-0 top-0 h-px w-9 bg-white/55" />
      <div className="absolute bottom-0 right-0 h-9 w-px bg-white/25" />
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {member.imageUrl ? (
          <motion.img
            src={member.imageUrl}
            alt={member.name}
            className="h-full w-full object-cover object-top"
            style={{ scale: reduceMotion ? 1 : imageScale, filter: isHighlighted ? 'none' : 'grayscale(1) contrast(1.06)' }}
          />
        ) : (
          <div className="relative grid h-full place-items-center overflow-hidden bg-black border border-white/10">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500">Next face</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(0,0,0,.88),rgba(0,0,0,.28),transparent)] px-2.5 pb-2.5 pt-8 sm:px-3 sm:pb-3">
          <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/64 sm:text-[8px]">{member.role}</span>
          <h3 className="mt-1 text-sm font-bold leading-[.95] tracking-[-0.045em] text-white sm:text-base">{member.name || 'Incoming'}</h3>
        </div>
        <span className="absolute left-2 top-2 border border-white/20 bg-black/45 px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">{String(index + 1).padStart(2, '0')}</span>
      </div>
      {member.bio && <p className="mt-2 hidden border-t border-white/10 pt-2 text-[10px] leading-snug text-neutral-500 xl:block">{member.bio}</p>}
    </motion.article>
  );
};

/** Faces assemble from a loose constellation into a still, legible contact sheet. */
export const CoreTeamSection: React.FC<CoreTeamSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 92, damping: 26, mass: 0.34 });
  const ruleScale = useTransform(progress, [0, 0.5], [0, 1]);
  const readoutOpacity = useTransform(progress, [0.45, 0.74], [0, 1]);

  return (
    <section ref={sectionRef} id="team" className="relative z-20 h-[205svh] overflow-clip border-b border-white/10 bg-black sm:h-[190svh]">
      <div className="sticky top-0 h-[100svh] min-h-[520px] overflow-hidden bg-black sm:min-h-[650px]">
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-4 pb-5 pt-16 sm:px-6 sm:pb-8 sm:pt-20 md:px-16">
          <div className="relative z-10 flex shrink-0 flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.21em] text-neutral-500 sm:text-[10px]">03 // Core team / 2026</span>
              <h2 className="max-w-[14ch] text-[clamp(2.35rem,5.2vw,5.8rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] text-white">The people behind aDOPE</h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-neutral-400 sm:pb-1 sm:text-sm">A contact sheet of the organisers, designers, and mentors turning campus moments into aDOPE work.</p>
          </div>

          <motion.div className="mt-5 h-px origin-left bg-white/45 sm:mt-7" style={reduceMotion ? { scaleX: 1 } : { scaleX: ruleScale }} />
          <div className="relative mt-4 grid min-h-0 flex-1 grid-cols-3 content-center gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4 lg:gap-4">
            {CORE_TEAM_DATA.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} progress={progress} highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} />
            ))}
          </div>
          <motion.div className="mt-3 flex shrink-0 items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-600 sm:mt-4 sm:text-[9px]" style={reduceMotion ? undefined : { opacity: readoutOpacity }}>
            <span>Collective direction / MGIT</span><span>7 points / one studio</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CORE_TEAM_DATA } from '../data/mockData';
import { CoreTeamMember } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface CoreTeamSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

interface TeamCardProps {
  member: CoreTeamMember;
  index: number;
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  member,
  index,
  highlightedImageId,
  onImageEnter,
  onImageLeave,
}) => {
  const imageId = `team-${member.id}`;
  const isHighlighted = highlightedImageId === imageId;

  return (
    <article
      className="team-card group relative flex flex-col h-full border border-white/15 bg-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300 hover:border-white/40 hover:shadow-[0_20px_45px_rgba(255,255,255,0.06)]"
      onPointerEnter={() => window.matchMedia('(hover: hover)').matches && member.imageUrl && onImageEnter(imageId)}
      onPointerLeave={() => window.matchMedia('(hover: hover)').matches && member.imageUrl && onImageLeave(imageId)}
      onClick={() => window.matchMedia('(hover: none)').matches && member.imageUrl && onImageEnter(imageId)}
    >
      {/* Decorative corner accents */}
      <div className="absolute left-0 top-0 h-px w-8 bg-white/40 z-10 transition-colors duration-300 group-hover:bg-white/80" />
      <div className="absolute bottom-0 right-0 h-8 w-px bg-white/20 z-10 transition-colors duration-300 group-hover:bg-white/60" />

      {/* Uniform Photo Container: fills area edge-to-edge with zero margins */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-neutral-900 overflow-hidden border-b border-white/10">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name || member.role}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              objectPosition: member.id === 'core-head' ? 'center 12%' : 'center 20%',
              filter: isHighlighted ? 'none' : 'grayscale(1) contrast(1.06)',
              transition: 'filter 350ms ease, transform 500ms ease-out',
            }}
          />
        ) : (
          /* Sleek placeholder for pending positions ensuring identical height */
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-white/10 bg-neutral-950 p-4 text-center">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-3">
              <span className="font-mono text-sm text-white/50">✦</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Position Pending</span>
            <span className="text-[10px] text-neutral-500 mt-1 font-mono">To Be Announced</span>
          </div>
        )}

        {/* Index counter badge */}
        <span className="absolute left-2.5 top-2.5 z-10 border border-white/20 bg-black/75 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Uniform Info Area below photo: designation, name, and bio */}
      <div className="flex flex-col flex-1 p-4 justify-between bg-black/70">
        <div>
          <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-white/50 font-semibold sm:text-[9px]">
            {member.role}
          </span>
          <h3 className="mt-1 text-sm font-bold leading-snug tracking-[-0.03em] text-white sm:text-base">
            {member.name || 'To Be Announced'}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[11px] leading-relaxed text-neutral-400">
            {member.bio || 'Faculty coordinator supporting the creative and administrative guidance of the club.'}
          </p>
        </div>
      </div>
    </article>
  );
};

export const CoreTeamSection: React.FC<CoreTeamSectionProps> = ({
  highlightedImageId,
  onImageEnter,
  onImageLeave,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animation with ScrollTrigger
  useEffect(() => {
    if (!cardsGridRef.current) return;
    const cards = cardsGridRef.current.querySelectorAll('.team-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsGridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="relative z-20 bg-black border-b border-white/10">
      {/* Section Header */}
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 md:px-16">
        <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.21em] text-neutral-500 sm:text-[10px]">
          03 // Core team / 2026
        </span>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-[14ch] text-[clamp(2.2rem,5.2vw,5.8rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] text-white">
            The people behind aDOPE
          </h2>
          <p className="max-w-sm text-xs leading-relaxed text-neutral-400 sm:pb-1 sm:text-sm">
            A contact sheet of the organisers, designers, and mentors turning campus moments into aDOPE work.
          </p>
        </div>
        <div className="mt-6 h-px bg-white/20 sm:mt-8" />
      </div>

      {/* Cards Grid: Uniform height and width across all cards */}
      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 sm:pb-20 md:px-16">
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch"
        >
          {CORE_TEAM_DATA.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              index={index}
              highlightedImageId={highlightedImageId}
              onImageEnter={onImageEnter}
              onImageLeave={onImageLeave}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-700 sm:text-[9px]">
          <span>Collective direction / MGIT</span>
          <span>7 points / one studio</span>
        </div>
      </div>
    </section>
  );
};

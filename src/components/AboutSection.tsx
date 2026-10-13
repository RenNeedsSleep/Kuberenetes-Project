import React from 'react';
import { CLUB_STATS } from '../data/mockData';

interface AboutSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const clubPhotoId = 'club-photo';
  const clubPhotoHighlighted = highlightedImageId === clubPhotoId;

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-[#131313] border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        <div
          className="group mb-12 grid overflow-hidden border border-white/10 bg-[#1A1A1A] sm:mb-16 lg:grid-cols-12"
          onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(clubPhotoId)}
          onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(clubPhotoId)}
          onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(clubPhotoId)}
        >
          <div className="relative overflow-hidden border-b border-white/10 lg:col-span-7 lg:border-b-0 lg:border-r">
            <img
              src="/adope-club-photo.jpeg"
              alt="aDOPE club members and faculty together at MGIT"
              className="block aspect-[3/2] h-full w-full object-cover transition-[filter,transform] duration-700"
              style={{ filter: clubPhotoHighlighted ? 'none' : 'grayscale(1)', transform: clubPhotoHighlighted ? 'scale(1.02)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 border border-white/25 bg-black/35 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm sm:left-6 sm:top-6">
              Meet the team
            </span>
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-5 block font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]">
                The people behind the practice
              </span>
              <h3 className="max-w-[12ch] text-3xl font-semibold uppercase leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl">
                Made together.
              </h3>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400 sm:text-base">
                A community of student designers, artists, and mentors shaping visual culture at MGIT.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-600">
              <span className="h-px w-8 bg-white/35" />MGIT design club
            </div>
          </div>
        </div>

        {/* Top Grid: Title + Description Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4">
              01 // Mission &amp; Ethos
            </span>
              <h2 className="max-w-[11ch] text-[clamp(1.5rem,3.1vw,2.75rem)] font-bold uppercase tracking-[-0.055em] text-white leading-[1.02]">
              Artists,<br />
              Designers &amp;<br />
              Originals
            </h2>
          </div>

          <div className="lg:col-span-7">
              <div className="max-w-2xl py-2 lg:py-8">
              <p className="text-lg sm:text-xl text-neutral-300 mb-6 leading-relaxed">
                aDOPE is the design club of Mahatma Gandhi Institute of Technology in Hyderabad. It brings student creatives together to make identities, posters, editorial work, digital art, interfaces, and merchandise for campus culture.
              </p>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                The club describes itself as a design team and digital art club. Its public archive shows a practice grounded in visual communication, collaborative briefs, and making memorable work for MGIT.
              </p>
            </div>
          </div>
        </div>

        {/* Live Club Stats Bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10 grid grid-cols-2 gap-5 sm:gap-8 text-center sm:text-left">
          {CLUB_STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
                {stat.label}
              </span>
              <span className="font-extrabold text-3xl sm:text-4xl text-white font-mono">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';

interface MeetTeamSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

export const MeetTeamSection: React.FC<MeetTeamSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const clubPhotoId = 'club-photo';
  const isHighlighted = highlightedImageId === clubPhotoId;

  return (
    <section aria-label="Meet the aDOPE team" className="relative z-20 bg-[#131313] px-4 pb-16 sm:px-6 sm:pb-24 md:px-16 lg:pb-32">
      <div className="group mx-auto grid max-w-[1440px] overflow-hidden border border-white/10 bg-[#1A1A1A] lg:grid-cols-12">
        <div
          className="relative overflow-hidden border-b border-white/10 lg:col-span-7 lg:border-b-0 lg:border-r"
          onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(clubPhotoId)}
          onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(clubPhotoId)}
          onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(clubPhotoId)}
        >
          <img
            src="/adope-club-photo.jpeg"
            alt="aDOPE club members and faculty together at MGIT"
            className="block aspect-[3/2] h-full w-full object-cover transition-[filter,transform] duration-700"
            style={{ filter: isHighlighted ? 'none' : 'grayscale(1)', transform: isHighlighted ? 'scale(1.02)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          <span className="absolute left-4 top-4 border border-white/25 bg-black/35 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm sm:left-6 sm:top-6">Meet the team</span>
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <div>
            <span className="mb-5 block font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]">The people behind the practice</span>
            <h3 className="max-w-[12ch] text-3xl font-semibold uppercase leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl">Made together.</h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400 sm:text-base">A community of student designers, artists, and mentors shaping visual culture at MGIT.</p>
          </div>
          <div className="mt-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-600"><span className="h-px w-8 bg-white/35" />MGIT design club</div>
        </div>
      </div>
    </section>
  );
};

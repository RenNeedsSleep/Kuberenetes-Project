import React, { useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ARTWORKS_DATA } from '../data/mockData';
import { Artwork } from '../types';
import { NirvanaPhoenix } from './NirvanaPhoenix';

gsap.registerPlugin(ScrollTrigger);

interface VisualOutputSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
}

export const VisualOutputSection: React.FC<VisualOutputSectionProps> = ({
  highlightedImageId,
  onImageEnter,
  onImageLeave,
  onSelectArtwork,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const posterArtworks = ARTWORKS_DATA.filter((art) => art.category === 'Posters');
  const posterCollection: Artwork = {
    id: 'art-poster-collection', title: 'Poster Collection', category: 'Posters',
    imageUrl: posterArtworks[0]?.imageUrl || '', description: 'Campaign posters and recruitment artwork from the aDOPE archive.',
    year: '2023–2026', artistName: 'aDOPE Club', specs: ['Poster Design', 'Campaigns', 'Print'],
    tags: ['Posters', 'Campaigns', 'Archive'], featured: true,
  };
  // Keep every poster together as one stop in the requested archive hierarchy.
  const artworks: Artwork[] = [
    ...ARTWORKS_DATA.filter((art) => art.category !== 'Posters').slice(0, 2),
    posterCollection,
    ...ARTWORKS_DATA.filter((art) => art.category !== 'Posters').slice(2),
  ];

  // GSAP ScrollTrigger staggered card reveal
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.bento-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 55,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="py-16 sm:py-24 lg:py-32 bg-black relative z-20 border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-5 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
              05 // Living Archive Gallery
            </span>
            <h2 className="section-heading font-extrabold uppercase leading-none tracking-tight text-white">
              Visual<br />
              Output
            </h2>
          </div>

          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            {artworks.length} Core Projects
          </span>
        </div>

        {/* Bento Grid Layout (Matching Old UI: 8+4 on row 1, 4+4+4 on row 2) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {artworks.map((art, idx) => {
            // Bento sizing rules
            let colSpan = 'md:col-span-4';
            let aspect = 'aspect-square';

            if (idx === 0) {
              colSpan = 'md:col-span-8';
              aspect = 'aspect-[16/9] min-h-[320px] sm:min-h-[420px]';
            } else if (idx === 1) {
              colSpan = 'md:col-span-4';
              aspect = 'h-full min-h-[280px] sm:min-h-[420px]';
            }

            const imageId = `work-${art.id}`;
            const isHovered = highlightedImageId === imageId;

            return (
              <div
                key={art.id}
                onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(imageId)}
                onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(imageId)}
                onClick={() => {
                  if (window.matchMedia('(hover: none)').matches && !isHovered) {
                    onImageEnter(imageId);
                    return;
                  }
                  onSelectArtwork(art.id === 'art-poster-collection' ? posterArtworks[0] : art);
                }}
                className={`bento-card ${colSpan} group cursor-pointer relative overflow-hidden border border-white/15 bg-neutral-950 transition-all duration-300 hover:border-white/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)]`}
              >
                <div className={`${aspect} relative overflow-hidden w-full flex flex-col justify-between`}>
                  {/* Decorative Corner Ticks */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/60 z-20 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/60 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white/40 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/40 z-20 pointer-events-none" />

                  {/* 3D Nirvana Phoenix for first card, high-res visual for others */}
                  {art.id === 'art-nirvana-2026' ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,160,70,0.14),transparent_60%)] pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <NirvanaPhoenix />
                      </div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-white/50 bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                        Drag to rotate
                      </div>
                    </>
                  ) : art.id === 'art-poster-collection' ? (
                    <div className="absolute inset-0 grid grid-cols-3 gap-1.5 bg-[#090705] p-2 sm:gap-2 sm:p-3">
                      {posterArtworks.map((poster, posterIndex) => (
                        <div key={poster.id} className={`relative min-h-0 overflow-hidden border border-amber-100/20 bg-black ${posterIndex === 0 ? 'row-span-2' : ''}`}>
                          <img src={poster.imageUrl} alt={poster.title} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                        </div>
                      ))}
                      <span className="absolute right-4 top-4 rounded border border-amber-200/50 bg-black/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[.16em] text-amber-100">{posterArtworks.length} posters / one archive</span>
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${art.imageUrl}')`,
                        filter: isHovered ? 'none' : 'grayscale(1) contrast(1.1)',
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    />
                  )}

                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/30 to-black/30 opacity-80 group-hover:opacity-50 transition-opacity duration-300" />

                  {/* Top Row: Category Badge & Eye Indicator */}
                  <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 pointer-events-none">
                    <span className="font-mono text-[9px] sm:text-[10px] bg-black/70 backdrop-blur-md px-2.5 py-1 uppercase tracking-widest border border-white/20 text-white/90">
                      {art.category}
                    </span>

                    <span className="p-1.5 sm:p-2 bg-black/70 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Bottom Meta Info */}
                  <div className="relative z-10 p-4 sm:p-6 pointer-events-none">
                    <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 block mb-1 uppercase tracking-wider">
                      BY {art.artistName.toUpperCase()} — {art.year}
                    </span>
                    <h4 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight uppercase group-hover:text-amber-200 transition-colors duration-200">
                      {art.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

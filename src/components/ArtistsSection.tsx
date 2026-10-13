import React, { useState } from 'react';
import { ARTISTS_DATA } from '../data/mockData';
import { Artist } from '../types';
import { Instagram, Linkedin, Github } from 'lucide-react';

export const ArtistsSection: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [touchedArtistImage, setTouchedArtistImage] = useState<string | null>(null);

  const specialties = ['All', 'Nirvana', 'Editorial', 'UI/UX', 'Posters', 'Logos'];

  const specialtyMatches: Record<string, string[]> = {
    Nirvana: ['branding', 'events', 'campaigns'],
    Editorial: ['editorial'],
    'UI/UX': ['ui/ux'],
    Posters: ['posters'],
    Logos: ['logo'],
  };

  const filteredArtists = selectedSpecialty === 'All'
    ? ARTISTS_DATA
    : ARTISTS_DATA.filter((a) =>
        a.specialty.some((s) => specialtyMatches[selectedSpecialty]?.some((match) => s.toLowerCase().includes(match)))
      );

  return (
    <section id="artists" className="py-16 sm:py-24 lg:py-32 bg-[#0E0E0E] border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-5 sm:gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
              02 // ARTWORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              Areas of Practice
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2" aria-label="Filter artists by specialty">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`min-h-10 font-mono text-[11px] sm:text-xs px-3 py-2 uppercase tracking-wider transition-all border ${
                  selectedSpecialty === spec
                    ? 'bg-white text-[#131313] border-white font-semibold'
                    : 'bg-[#1A1A1A] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredArtists.map((artist: Artist) => (
            <div
              key={artist.id}
              className="bg-[#1A1A1A] border border-white/10 p-4 sm:p-6 flex flex-col justify-between group hover:border-white/40 transition-all duration-300 relative"
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />

              <div>
                <div
                  className="relative overflow-hidden mb-6 aspect-square bg-[#131313] border border-white/5"
                  onClick={() => setTouchedArtistImage(artist.id)}
                >
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover grayscale mix-blend-luminosity transition-all duration-500 scale-100 md:group-hover:scale-105 md:group-hover:grayscale-0 md:group-hover:mix-blend-normal"
                    style={touchedArtistImage === artist.id ? { filter: 'none', mixBlendMode: 'normal' } : undefined}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
                </div>

                <h3 className="font-extrabold text-xl text-white tracking-tight mb-1">
                  {artist.name}
                </h3>
                <p className="font-mono text-xs text-neutral-400 mb-4 font-medium">
                  {artist.role}
                </p>

                <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                  {artist.bio}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {artist.specialty.map((spec, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] uppercase bg-white/5 text-neutral-300 px-2 py-0.5 border border-white/10"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10 text-neutral-400">
                  {artist.instagramUrl && (
                    <a
                      href={artist.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors p-1"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {artist.linkedinUrl && (
                    <a
                      href={artist.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors p-1"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {artist.githubUrl && (
                    <a
                      href={artist.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors p-1"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

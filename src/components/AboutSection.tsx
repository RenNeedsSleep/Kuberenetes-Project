import React from 'react';
import { CLUB_STATS } from '../data/mockData';
import { Sparkles, Terminal, Cpu, Layers } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: <Layers className="w-5 h-5 text-white/80" />,
      title: 'Visual Identity',
      desc: 'Logos, brand systems, and visual direction for clubs, events, and campus initiatives.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-white/80" />,
      title: 'Digital Art',
      desc: "Screen-based design and digital experiments that extend aDOPE's graphic language."
    },
    {
      icon: <Terminal className="w-5 h-5 text-white/80" />,
      title: 'Editorial Craft',
      desc: 'Magazine layouts, posters, typography, and print compositions built to communicate clearly.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-white/80" />,
      title: 'Campus Culture',
      desc: 'A student-led team shaping how MGIT events and ideas are seen, remembered, and shared.'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-[#131313] border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        <div className="group mb-12 grid overflow-hidden border border-white/10 bg-[#1A1A1A] sm:mb-16 lg:grid-cols-12">
          <div className="relative overflow-hidden border-b border-white/10 lg:col-span-7 lg:border-b-0 lg:border-r">
            <img
              src="/adope-club-photo.jpeg"
              alt="aDOPE club members and faculty together at MGIT"
              className="block aspect-[3/2] h-full w-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 border border-white/25 bg-black/35 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm sm:left-6 sm:top-6">
              aDOPE / MGIT
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
              01 // Vision &amp; Mission
            </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
              Artists,<br />
              Designers &amp;<br />
              Originals
            </h2>
          </div>

          <div className="lg:col-span-7">
              <div className="bg-[#1A1A1A] border border-white/10 p-5 sm:p-8 lg:p-12 relative group hover:bg-[#222222] transition-colors duration-500">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/40 group-hover:border-white transition-colors" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/40 group-hover:border-white transition-colors" />

              <p className="font-sans text-lg sm:text-xl text-neutral-300 mb-6 leading-relaxed">
                aDOPE is the design club of Mahatma Gandhi Institute of Technology in Hyderabad. It brings student creatives together to make identities, posters, editorial work, digital art, interfaces, and merchandise for campus culture.
              </p>
              <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
                The club describes itself as a design team and digital art club. Its public archive shows a practice grounded in visual communication, collaborative briefs, and making memorable work for MGIT.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 sm:mt-12">
          <article className="bg-[#131313] p-5 sm:p-7">
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">Mission</h3>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Bring student creatives together to make identities, images, and experiences that shape campus culture.
            </p>
          </article>
          <article className="bg-[#131313] p-5 sm:p-7">
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">Vision</h3>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Build a collaborative design community where bold ideas grow into work people remember.
            </p>
          </article>
        </div>

        {/* Pillars Grid */}
        <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#1A1A1A]/60 border border-white/10 p-5 sm:p-6 relative group hover:border-white/30 transition-all hover:-translate-y-1"
            >
              <div className="mb-4">{pillar.icon}</div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-white mb-2 font-semibold">
                {pillar.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Live Club Stats Bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 text-center sm:text-left">
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

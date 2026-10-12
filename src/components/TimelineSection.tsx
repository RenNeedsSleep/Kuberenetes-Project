import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { TIMELINE_DATA } from '../data/mockData';

// A compact, top-down circuit: three straights joined by clean, flowing bends.
const CIRCUIT_PATH = 'M 70 186 C 155 186 205 186 258 186 C 304 186 317 151 317 116 C 317 83 341 62 376 62 L 438 62 C 482 62 500 91 500 126 L 500 191 C 500 225 523 248 559 248 L 619 248 C 657 248 675 219 675 185 L 675 129 C 675 96 698 73 732 73 L 814 73 C 858 73 879 105 879 139 C 879 166 895 186 930 186';
const CHECKPOINTS = [
  { x: 70, y: 186, label: '01' },
  { x: 500, y: 126, label: '02' },
  { x: 930, y: 186, label: '03' },
];

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const easedProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  useMotionValueEvent(easedProgress, 'change', (progress) => {
    const nextIndex = Math.min(2, Math.floor(progress * 3));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  return (
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[155svh] bg-[#101010] md:h-[175svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
          <header className="mb-4 sm:mb-7">
            <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-500 sm:text-[10px]">04 / The aDOPE archive · MGIT, Hyderabad</span>
            <h2 className="text-2xl font-semibold uppercase tracking-[-0.055em] text-white sm:text-4xl">History in motion</h2>
          </header>

          <div className="relative mx-auto w-full max-w-[920px]">
            <div className="mb-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.19em] text-neutral-600 sm:text-[9px]">
              <span>Archive route</span><span>Scroll to navigate <span className="text-neutral-400">↘</span></span>
            </div>

            <svg viewBox="0 0 1000 300" className="block h-auto w-full overflow-visible" role="img" aria-label="A horizontal circuit route connecting three aDOPE milestones">
              <defs>
                <filter id="archive-glow" x="-30%" y="-100%" width="160%" height="300%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d={CIRCUIT_PATH} transform="translate(0 0)" fill="none" stroke="#282b2e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d={CIRCUIT_PATH} fill="none" stroke="#62676b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              <path d={CIRCUIT_PATH} fill="none" stroke="#73797e" strokeWidth="1" strokeDasharray="4 10" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
              <motion.path d={CIRCUIT_PATH} fill="none" stroke="#f2f5f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#archive-glow)" style={{ pathLength: easedProgress }} />

              {CHECKPOINTS.map((point, index) => {
                const isActive = activeIndex === index;
                return (
                  <g key={point.label}>
                    {isActive && <circle cx={point.x} cy={point.y} r="17" fill="#fff" opacity="0.08" />}
                    <circle cx={point.x} cy={point.y} r={isActive ? 5 : 3.5} fill={isActive ? '#fff' : '#777d82'} />
                    <text x={point.x} y={point.y - 24} textAnchor="middle" fill={isActive ? '#fff' : '#777d82'} fontSize="10" fontFamily="monospace" letterSpacing="2">{point.label}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-0 grid grid-cols-3 gap-3 sm:mt-1 sm:gap-6">
              {TIMELINE_DATA.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.article
                    key={item.id}
                    animate={{ opacity: isActive ? 1 : 0.42, y: isActive ? 0 : 4 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    aria-current={isActive ? 'step' : undefined}
                    className={`border-t pt-3 sm:pt-4 ${isActive ? 'border-white/75' : 'border-white/15'}`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[7px] uppercase tracking-[0.12em] text-neutral-500 sm:text-[9px] sm:tracking-[0.17em]">
                      <span>{item.version}</span><span className="hidden sm:inline">{item.category}</span>
                    </div>
                    <h3 className="mb-1.5 text-xs font-medium leading-snug tracking-[-0.02em] text-white sm:text-base">{item.title}</h3>
                    <p className="max-w-[34ch] text-[10px] leading-relaxed text-neutral-400 sm:text-xs">{item.description}</p>
                  </motion.article>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-600 sm:mt-5">
              <span className="h-px w-8 bg-white/35" />{String(activeIndex + 1).padStart(2, '0')} <span className="text-neutral-700">/</span> {String(TIMELINE_DATA.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Gauge } from 'lucide-react';
import { TIMELINE_DATA } from '../data/mockData';

const CIRCUIT_PATH = 'M 780 490 C 816 495 842 470 825 433 L 745 285 C 730 255 707 240 673 239 L 610 239 C 585 239 570 222 558 200 C 543 174 520 168 495 178 L 422 207 C 385 222 350 205 337 175 C 324 145 340 117 363 90 C 385 65 371 40 345 44 C 314 48 294 78 273 109 C 250 144 216 157 185 144 C 153 132 145 105 167 81 C 190 55 177 31 151 36 C 115 42 88 78 80 115 C 71 155 95 183 131 205 L 384 357 C 422 380 466 369 498 342 L 546 301 C 573 278 606 284 621 311 C 638 341 622 366 594 382 L 559 401 C 530 417 528 449 548 470 C 568 490 596 482 618 465 L 669 427 C 699 405 728 413 742 444 L 785 531 C 797 557 780 575 750 566 C 722 557 712 530 724 509 L 744 473 C 756 451 777 462 780 490 Z';

const STATIONS = [
  { x: 780, y: 490, label: 'ORIGIN / MGIT' },
  { x: 337, y: 175, label: 'EVENTS / BRANDING' },
  { x: 384, y: 357, label: 'PORTFOLIO / OUTPUT' },
];

const CHECKPOINT_POPUP_POSITIONS = [
  { x: 93.4, y: 56.1, above: true },
  { x: 29.8, y: 39.5, above: false },
  { x: 44, y: 64.1, above: false },
];

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const laserHeadRef = useRef<SVGGElement>(null);
  const checkpointProgressRef = useRef<number[]>([0, 0.4, 0.76]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const path = trackPathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    checkpointProgressRef.current = STATIONS.map((station) => {
      let closestProgress = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      for (let sample = 0; sample <= 500; sample += 1) {
        const progress = sample / 500;
        const point = path.getPointAtLength(totalLength * progress);
        const dx = point.x - station.x;
        const dy = point.y - station.y;
        const distance = dx * dx + dy * dy;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestProgress = progress;
        }
      }
      return closestProgress;
    });
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const checkpoints = checkpointProgressRef.current;
    const nextIndex = progress < checkpoints[1] ? 0 : progress < checkpoints[2] ? 1 : 2;
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    const path = trackPathRef.current;
    const head = laserHeadRef.current;
    if (path && head) {
      const point = path.getPointAtLength(path.getTotalLength() * progress);
      head.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }
  });

  const activeItem = TIMELINE_DATA[activeIndex];

  return (
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[220svh] bg-[#101010] md:h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="relative mx-auto h-screen w-full max-w-none px-0">
          <div className="absolute inset-x-0 top-3 z-20 text-center sm:top-5">
            <div>
              <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-500 sm:mb-2 sm:text-[10px]">04 / The aDOPE archive · MGIT, Hyderabad</span>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.045em] text-white sm:text-4xl">A history in motion</h2>
            </div>
          </div>

          <div className="absolute left-1/2 top-[54%] aspect-[840/590] w-[min(94vw,720px)] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-0 top-0 z-10 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:text-[9px]">
              <Gauge className="h-3 w-3" /> Top-view archive route / 01 · Three entries
            </div>
            <svg viewBox="45 8 840 590" preserveAspectRatio="xMidYMid meet" className="block h-full w-full md:rotate-[-25deg]" role="img" aria-label="Top-down view of the aDOPE archive route; the route draws as the timeline advances">
                <defs>
                  <filter id="timeline-laser-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="timeline-head-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                  <radialGradient id="timeline-head-halo">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#ffffff" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Layered strokes turn the route into a flat, readable top-down track. */}
                <path d={CIRCUIT_PATH} fill="none" stroke="#090a0c" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#25292e" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#72777b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#a2a6a8" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 13" opacity="0.72" />
                <motion.path
                  ref={trackPathRef}
                  d={CIRCUIT_PATH}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.42"
                  filter="url(#timeline-laser-glow)"
                  style={{ pathLength: scrollYProgress }}
                />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#f1feff" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />

                <g ref={laserHeadRef} transform={`translate(${STATIONS[0].x} ${STATIONS[0].y})`} pointerEvents="none">
                  <circle r="22" fill="url(#timeline-head-halo)" />
                  <circle r="11" fill="#ffffff" opacity="0.24" filter="url(#timeline-head-glow)" />
                  <circle r="4.5" fill="#ffffff" />
                  <circle r="2" fill="#ffffff" />
                </g>

                {STATIONS.map((station, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <g key={station.label} aria-label={`Checkpoint ${station.label}: ${TIMELINE_DATA[index].title}`}>
                      {isActive && <circle cx={station.x} cy={station.y} r="14" fill="#ffffff" opacity="0.1" />}
                      <circle cx={station.x} cy={station.y} r={isActive ? 5.5 : 4.5} fill={isActive ? '#ffffff' : '#a3a8ad'} stroke="#101010" strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>

            <motion.article
              key={activeItem.id}
              initial={false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0 }}
              style={{
                left: `clamp(0.25rem, calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].x}% - 160px), calc(100% - min(320px, calc(100% - 0.5rem)) - 0.25rem))`,
                top: CHECKPOINT_POPUP_POSITIONS[activeIndex].above
                  ? `calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].y}% - 1rem)`
                  : `calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].y}% + 1rem)`,
                transform: CHECKPOINT_POPUP_POSITIONS[activeIndex].above ? 'translateY(-100%)' : undefined,
                width: 'min(320px, calc(100% - 0.5rem))',
              }}
              className="absolute z-20 grid grid-cols-[72px_1fr] gap-2 border border-white/20 bg-[#171717]/95 p-2.5 shadow-[0_20px_80px_rgba(0,0,0,0.75)] backdrop-blur-md sm:grid-cols-[132px_1fr] sm:gap-4 sm:p-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <img src={activeItem.imageUrl} alt={activeItem.title} className="h-20 w-full object-cover grayscale sm:h-28" />
              <div className="self-center">
                <span className="mb-1 block font-mono text-[7px] uppercase tracking-[0.12em] text-neutral-500 sm:text-[8px] sm:tracking-[0.16em]">{STATIONS[activeIndex].label} · {activeItem.version}</span>
                <h3 className="mb-1 text-xs font-semibold leading-tight tracking-[-0.035em] text-white sm:text-lg">{activeItem.title}</h3>
                <p className="text-[8px] leading-relaxed text-neutral-400 sm:text-[11px]">{activeItem.description}</p>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

    </section>
  );
};

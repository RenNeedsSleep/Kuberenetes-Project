import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ARTISTS_DATA } from '../data/mockData';
import { Artist } from '../types';

/* ─── CSS injected once ─────────────────────────────────────────── */
const STYLE = `
@keyframes aop-scanline {
  0%   { transform: translateX(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}
@keyframes aop-ticker {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes aop-slideup {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.aop-row {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
  transition:
    background-color 500ms cubic-bezier(0.16,1,0.3,1),
    padding-top 500ms cubic-bezier(0.16,1,0.3,1),
    padding-bottom 500ms cubic-bezier(0.16,1,0.3,1);
}
.aop-row::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 55%;
  background: linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.05) 50%,
    rgba(255,255,255,0) 100%);
  pointer-events: none;
  opacity: 0;
  transform: translateX(-100%);
}
.aop-row:hover::after {
  animation: aop-scanline 700ms cubic-bezier(0.16,1,0.3,1) forwards;
}
.aop-row-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.08);
  transition:
    opacity 600ms cubic-bezier(0.16,1,0.3,1),
    transform 700ms cubic-bezier(0.16,1,0.3,1);
  pointer-events: none;
  filter: grayscale(0.4) contrast(1.05);
}
.aop-row:hover .aop-row-bg {
  opacity: 1;
  transform: scale(1);
}
.aop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.90) 0%,
    rgba(0,0,0,0.60) 52%,
    rgba(0,0,0,0.20) 100%
  );
  opacity: 0;
  transition: opacity 500ms cubic-bezier(0.16,1,0.3,1);
  pointer-events: none;
}
.aop-row:hover .aop-overlay { opacity: 1; }
.aop-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.25rem;
  transition:
    padding-top 500ms cubic-bezier(0.16,1,0.3,1),
    padding-bottom 500ms cubic-bezier(0.16,1,0.3,1);
}
@media(min-width:640px) {
  .aop-inner {
    grid-template-columns: 4.5rem 1fr 1fr auto;
    padding: 1.5rem 1.75rem;
  }
}
@media(min-width:1024px) {
  .aop-inner {
    padding: 1.6rem 3.5rem;
  }
}
.aop-row:hover .aop-inner {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
@media(min-width:640px) {
  .aop-row:hover .aop-inner { padding-top: 2.5rem; padding-bottom: 2.5rem; }
}
.aop-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.22);
  text-transform: uppercase;
  transition: color 400ms ease;
  user-select: none;
}
.aop-row:hover .aop-num { color: rgba(255,255,255,0.55); }
.aop-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(1.4rem, 4vw, 3.8rem);
  letter-spacing: -0.065em;
  line-height: 1;
  color: rgba(255,255,255,0.88);
  text-transform: uppercase;
  transition:
    letter-spacing 500ms cubic-bezier(0.16,1,0.3,1),
    color 400ms ease;
}
.aop-row:hover .aop-title {
  color: #fff;
  letter-spacing: -0.04em;
}
.aop-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0);
  margin-bottom: 0.4rem;
  transition: color 350ms ease 40ms;
}
.aop-row:hover .aop-role { color: rgba(255,255,255,0.45); }
.aop-bio {
  font-size: 0.8rem;
  line-height: 1.65;
  color: rgba(255,255,255,0);
  max-width: 40ch;
  transition: color 400ms cubic-bezier(0.16,1,0.3,1) 60ms;
  display: none;
}
@media(min-width:640px) { .aop-bio { display: block; } }
.aop-row:hover .aop-bio { color: rgba(255,255,255,0.6); }
.aop-tags {
  display: none;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.75rem;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 400ms cubic-bezier(0.16,1,0.3,1) 90ms,
    transform 400ms cubic-bezier(0.16,1,0.3,1) 90ms;
}
@media(min-width:640px) { .aop-tags { display: flex; } }
.aop-row:hover .aop-tags { opacity: 1; transform: translateY(0); }
.aop-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.2rem 0.5rem;
  color: rgba(255,255,255,0.65);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}
.aop-arrow {
  flex-shrink: 0;
  color: rgba(255,255,255,0.15);
  transition:
    color 350ms ease,
    transform 350ms cubic-bezier(0.16,1,0.3,1);
}
.aop-row:hover .aop-arrow {
  color: rgba(255,255,255,0.9);
  transform: translate(5px,-5px);
}
/* Slide-up on scroll-into-view (fires once) */
.aop-reveal {
  opacity: 0;
  transform: translateY(32px);
}
.aop-reveal.aop-visible {
  animation: aop-slideup 600ms cubic-bezier(0.16,1,0.3,1) forwards;
}
/* Ambient vertical word ticker */
.aop-ticker-track {
  animation: aop-ticker 22s linear infinite;
  will-change: transform;
}
/* Bottom sweep progress line */
.aop-progress {
  position: absolute;
  bottom: 0; left: 0;
  height: 1px;
  background: rgba(255,255,255,0.7);
  width: 0%;
  transition: width 0s;
}
.aop-row:hover .aop-progress {
  width: 100%;
  transition: width 480ms cubic-bezier(0.16,1,0.3,1);
}
/* Left accent line */
.aop-accent {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 2px;
  background: rgba(255,255,255,0);
  transition: background 400ms ease;
}
.aop-row:hover .aop-accent {
  background: rgba(255,255,255,0.6);
}
`;

/* ─── Single practice row ────────────────────────────────────────── */
const PracticeRow: React.FC<{ artist: Artist; index: number; total: number }> = ({
  artist,
  index,
  total,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${index * 80}ms`;
          el.classList.add('aop-visible');
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="aop-row aop-reveal"
      role="article"
      aria-label={`Practice ${index + 1} of ${total}: ${artist.name}`}
    >
      {/* Background image */}
      <div className="aop-row-bg" style={{ backgroundImage: `url('${artist.avatarUrl}')` }} />
      {/* Dark overlay */}
      <div className="aop-overlay" />
      {/* Left accent bar */}
      <div className="aop-accent" />
      {/* Bottom progress sweep */}
      <div className="aop-progress" />

      <div className="aop-inner">
        {/* Index */}
        <span className="aop-num">{String(index + 1).padStart(2, '0')}</span>

        {/* Title block */}
        <div>
          <div className="aop-role">{artist.role}</div>
          <div className="aop-title">{artist.name}</div>
          <div className="aop-tags">
            {artist.specialty.map((s) => (
              <span key={s} className="aop-tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <p className="aop-bio">{artist.bio}</p>

        {/* Arrow */}
        <ArrowUpRight className="aop-arrow" size={20} aria-hidden="true" />
      </div>
    </div>
  );
};

/* ─── Ambient vertical ticker ─────────────────────────────────────── */
const TICKER_WORDS = ['Brand', 'Type', 'Print', 'Screen', 'Mark', 'Form', 'Color', 'Space', 'Motion', 'Grid'];

const Ticker: React.FC = () => {
  const words = [...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-10 sm:w-14 z-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="aop-ticker-track flex flex-col items-center gap-7 py-4">
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              writingMode: 'vertical-rl',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.52rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.055)',
              whiteSpace: 'nowrap',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Section ────────────────────────────────────────────────────── */
interface ArtistsSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = () => {
  // Inject CSS once on mount
  useEffect(() => {
    const id = 'aop-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = STYLE;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <section id="artists" className="relative z-20 bg-black overflow-hidden">
      {/* ── Section header ─────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/10 px-4 pt-16 pb-10 sm:px-6 sm:pt-20 md:px-14">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.21em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            display: 'block',
            marginBottom: '0.55rem',
          }}
        >
          02 // Disciplines in motion
        </span>
        <div className="flex items-end justify-between gap-4">
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              letterSpacing: '-0.065em',
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1,
            }}
          >
            Areas of Practice
          </h2>
          <span
            className="hidden sm:block"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
            }}
          >
            {String(ARTISTS_DATA.length).padStart(2, '0')} practices
          </span>
        </div>
        <div className="mt-8 h-px bg-white/10" />
      </div>

      {/* ── Practice rows ──────────────────────────────────── */}
      <div className="relative">
        <Ticker />
        {ARTISTS_DATA.map((artist, i) => (
          <PracticeRow key={artist.id} artist={artist} index={i} total={ARTISTS_DATA.length} />
        ))}
        <div className="h-px bg-white/10" />
      </div>
    </section>
  );
};

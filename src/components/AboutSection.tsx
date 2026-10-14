import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * The opening statement is treated as a short scroll scene instead of a static
 * content block. The content never leaves the document flow, but the stage
 * holds while its layers assemble and then hand the eye to the next section.
 */
export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 92, damping: 26, mass: 0.34 });

  const titleX = useTransform(progress, [0, 0.35, 1], ['-12vw', '0vw', '0vw']);
  const titleScale = useTransform(progress, [0, 0.38, 1], [0.94, 1, 1]);
  const titleRotate = useTransform(progress, [0, 0.38, 1], [-2.5, 0, 0]);
  const titleOpacity = useTransform(progress, [0, 0.18, 1], [0.35, 1, 1]);

  const statementX = useTransform(progress, [0, 0.35, 1], ['12vw', '0vw', '0vw']);
  const statementOpacity = useTransform(progress, [0, 0.2, 1], [0.25, 1, 1]);
  const lineScale = useTransform(progress, [0.08, 0.42], [0, 1]);
  const orbit = useTransform(progress, [0, 1], [-22, 138]);

  const sceneStyle = reduceMotion ? undefined : { x: titleX, scale: titleScale, rotate: titleRotate, opacity: titleOpacity };
  const statementStyle = reduceMotion ? undefined : { x: statementX, opacity: statementOpacity };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 h-[155svh] overflow-clip border-b border-white/10 bg-black sm:h-[165svh]"
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[580px] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:clamp(48px,7vw,104px)_clamp(48px,7vw,104px)]" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-16vw] top-[12%] h-[46vw] w-[46vw] rounded-full border border-white/10 sm:left-[-9vw] sm:h-[32vw] sm:w-[32vw]"
          style={reduceMotion ? undefined : { rotate: orbit }}
        >
          <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_22px_7px_rgba(255,255,255,.25)]" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[18vw] bottom-[-10vw] h-[48vw] w-[48vw] rounded-full border border-white/10 sm:-right-[9vw] sm:h-[35vw] sm:w-[35vw]"
          style={reduceMotion ? undefined : { rotate: orbit }}
        >
          <span className="absolute left-0 top-[20%] h-3 w-3 rounded-full border border-white/60 bg-black" />
        </motion.div>

        <div className="relative mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 md:px-16">
          <div className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 sm:mb-8 sm:text-[10px]">
            <span className="h-px w-10 bg-white/50" />
            01 // Mission &amp; Ethos
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
            {/* Title: The whole 'Artists, Designers & The Originals' fits comfortably */}
            <motion.div style={sceneStyle} className="relative z-10">
              <h2 className="text-[clamp(2.4rem,5.6vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.06em] text-white">
                Artists,<br />
                Designers &amp;<br />
                <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.72)] sm:[-webkit-text-stroke:2px_rgba(255,255,255,.72)]">The Originals</span>
              </h2>
            </motion.div>

            {/* Bio: Visible at the exact same time alongside the full title */}
            <motion.div className="relative z-10 max-w-xl" style={statementStyle}>
              <motion.div className="mb-5 h-px origin-left bg-white/60" style={reduceMotion ? undefined : { scaleX: lineScale }} />
              <p className="text-[clamp(1.05rem,1.4vw,1.38rem)] leading-[1.48] text-neutral-200">
                aDOPE is the design club of Mahatma Gandhi Institute of Technology in Hyderabad. It brings student creatives together to make identities, posters, editorial work, digital art, interfaces, and merchandise for campus culture.
              </p>
              <p className="mt-4 max-w-[55ch] text-xs leading-relaxed text-neutral-400 sm:mt-5 sm:text-sm">
                The club describes itself as a design team and digital art club. Its public archive shows a practice grounded in visual communication, collaborative briefs, and making memorable work for MGIT.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 sm:mt-8">
                <span className="border border-white/15 px-2.5 py-1.5">MGIT / Hyderabad</span>
                <span className="border border-white/15 px-2.5 py-1.5">Since the first brief</span>
              </div>
            </motion.div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 right-4 font-mono text-[8px] uppercase tracking-[0.28em] text-white/30 sm:bottom-9 sm:right-8"
        >
          Scroll / to explore
        </span>
      </div>
    </section>
  );
};

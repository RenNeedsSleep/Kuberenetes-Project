import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { LaserCollection } from '../shaders/laser/LaserCollection';
import '../shaders/threeui.css';

/** A deliberately contained use of the verified ThreeUI Matrix Junction field. */
export const MatrixJunctionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 84, damping: 24, mass: 0.34 });
  const panelY = useTransform(progress, [0, 0.5, 1], ['12vh', '0vh', '-7vh']);
  const panelScale = useTransform(progress, [0, 0.5, 1], [0.93, 1, 0.97]);
  const copyY = useTransform(progress, [0, 0.5], ['5vh', '0vh']);
  const progressWidth = useTransform(progress, [0, 1], ['16%', '100%']);

  return (
    <section ref={sectionRef} id="signal" className="relative z-20 h-[156svh] overflow-clip bg-[#0d0d0d]">
      <div className="sticky top-0 flex h-[100svh] min-h-[620px] items-center overflow-hidden px-4 sm:px-6 md:px-16">
        <motion.div
          className="relative mx-auto h-[min(72svh,720px)] w-full max-w-[1440px] overflow-hidden border border-white/15 bg-[#030303] shadow-[0_35px_120px_rgba(0,0,0,.62)]"
          style={reduceMotion ? undefined : { y: panelY, scale: panelScale }}
        >
          <LaserCollection
            variant="matrix-field"
            speed={1}
            size={1}
            length={1.46}
            density={1}
            opacity={1}
            hue={-12}
            saturation={1}
            brightness={0.67}
            className="absolute inset-0 h-full w-full"
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.72),transparent_36%,transparent_64%,rgba(3,3,3,.6)),linear-gradient(0deg,rgba(3,3,3,.72),transparent_30%)]" />
          <motion.div className="pointer-events-none absolute left-5 top-5 max-w-[19rem] sm:left-8 sm:top-8 md:left-12 md:top-12" style={reduceMotion ? undefined : { y: copyY }}>
            <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.24em] text-white/55 sm:text-[10px]">06 // Closing signal</span>
            <h2 className="text-[clamp(2.5rem,5.8vw,6rem)] font-black uppercase leading-[0.78] tracking-[-0.085em] text-white">Make the<br />next move.</h2>
          </motion.div>

          <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/55 sm:bottom-8 sm:left-8 sm:right-8 sm:text-[9px] md:bottom-12 md:left-12 md:right-12">
            <span className="max-w-[24ch] leading-relaxed">Pointer-reactive Matrix Junction<br />Nirvana transmission / live</span>
            <span className="hidden text-right sm:block">Drag nothing.<br />Move through it.</span>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20">
            <motion.span className="block h-px bg-white" style={reduceMotion ? { width: '100%' } : { width: progressWidth }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

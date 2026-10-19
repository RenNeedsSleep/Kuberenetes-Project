import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import * as THREE from 'three';

interface MeetTeamSectionProps {
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
}

const TOOL_LOGOS = [
  { name: 'Photoshop', src: '/tools/photoshop.png' },
  { name: 'Premiere Pro', src: '/tools/premiere.png' },
  { name: 'DaVinci Resolve', src: '/tools/davinci.png' },
  { name: 'Figma', src: '/tools/figma.png' },
  { name: 'After Effects', src: '/tools/aftereffects.png' },
];

/* CSS-only orbital ring — injected once */
const ORBIT_STYLE = `
@keyframes orbit-ring {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes orbit-icon-counter {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(-360deg); }
}
.orbit-ring {
  animation: orbit-ring 18s linear infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .orbit-ring { animation: none; }
}
`;

export const MeetTeamSection: React.FC<MeetTeamSectionProps> = ({ highlightedImageId, onImageEnter, onImageLeave }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const clubPhotoId = 'club-photo';
  const isHighlighted = highlightedImageId === clubPhotoId;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.34 });

  // Text starts from top-left and settles at top-center
  const copyX = useTransform(progress, [0, 0.68, 1], ['-40vw', '0vw', '0vw']);
  const copyY = useTransform(progress, [0, 0.68, 1], ['-30vh', '0vh', '0vh']);

  // Photo starts from bottom-right and settles at bottom-center
  const frameX = useTransform(progress, [0, 0.68, 1], ['40vw', '0vw', '0vw']);
  const frameY = useTransform(progress, [0, 0.68, 1], ['30vh', '0vh', '0vh']);

  // Inject CSS-only orbit styles once
  useEffect(() => {
    const id = 'orbit-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = ORBIT_STYLE;
      document.head.appendChild(tag);
    }
  }, []);

  // Three.js ambient cosmic star/particle background
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 18;

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Subtle drifting star/particle field
    const particleCount = 260;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.32,
    });
    const particleSystem = new THREE.Points(geometry, pMaterial);
    scene.add(particleSystem);

    let rafId = 0;
    let isVisible = false;

    const animate = () => {
      if (!isVisible) return;
      rafId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.0006;
      particleSystem.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animate);
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    });
    visibilityObserver.observe(mount);

    const handleResize = () => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      pMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Meet the team" className="relative z-20 h-[145svh] overflow-clip bg-black sm:h-[155svh]">
      <div className="sticky top-0 flex h-[100svh] min-h-[580px] flex-col items-center justify-center gap-5 border-b border-white/10 bg-black px-4 py-6 sm:gap-8 sm:py-8 md:gap-10 md:py-10">
        {/* Three.js Motion Canvas (Particles) in the background */}
        <div ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

        {/* Ambient radial lighting */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(255,255,255,0.05),transparent_68%)]" />

        {/* Text — enters from top-left, stops at top-middle */}
        <motion.div
          className="relative z-20 flex w-full flex-col items-center justify-center text-center"
          style={reduceMotion ? undefined : { x: copyX, y: copyY }}
        >
          <span className="relative z-10 mb-2 block font-mono text-[9px] uppercase tracking-[0.21em] text-neutral-400 sm:text-[10px]">
            03 // The Collective · Made Together
          </span>
          <h2 className="section-heading relative z-10 font-extrabold uppercase leading-none tracking-[-0.06em] text-white">
            MEET THE TEAM
          </h2>
        </motion.div>

        {/* Photo Stage with circular orbiting grayscale tool logos around it */}
        <motion.div
          className="relative z-10 mx-auto flex max-h-[62svh] w-full max-w-[840px] items-center justify-center sm:max-h-[64svh] md:max-h-[66svh]"
          style={reduceMotion ? undefined : { x: frameX, y: frameY }}
          onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(clubPhotoId)}
          onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(clubPhotoId)}
          onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(clubPhotoId)}
        >
          {/* CSS-only orbital ring — no JS per frame */}
          <div
            className="orbit-ring pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            style={{ transformOrigin: 'center center' }}
          >
            {TOOL_LOGOS.map((logo, index) => {
              const angleDeg = (index * 360) / TOOL_LOGOS.length;
              // Each icon: rotate to position on ring, translate outward, then counter-rotate to stay upright
              return (
                <div
                  key={logo.name}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${angleDeg}deg) translate(min(48vw, 360px)) rotate(-${angleDeg}deg) translate(-50%, -50%)`,
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl border border-white/15 bg-black/75 p-2 sm:p-3 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                    style={{ animation: 'orbit-icon-counter 18s linear infinite' }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-7 w-7 sm:h-10 sm:w-10 object-contain"
                      style={{ filter: 'grayscale(100%) contrast(1.15) brightness(0.9)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Team Photo */}
          <img
            src="/adope-club-photo.jpeg"
            alt="aDOPE club members and faculty together at MGIT"
            className="relative z-10 block h-auto max-h-[62svh] w-auto max-w-full rounded border border-white/15 object-contain shadow-2xl transition-all duration-300 sm:max-h-[64svh] md:max-h-[66svh]"
            style={{
              filter: isHighlighted ? 'none' : 'grayscale(1) contrast(1.05)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import * as THREE from 'three';
import { LOGO_URL } from '../data/mockData';

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

  // Continuous circular/orbital animation for logos around the photo
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let rafId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      // Smooth continuous 360-degree circular orbit
      setOrbitAngle((prev) => (prev + delta * 0.28) % (Math.PI * 2));
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

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

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.0006;
      particleSystem.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

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
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      pMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Meet the team" className="relative z-20 h-[145svh] overflow-clip bg-black sm:h-[155svh]">
      <div className="sticky top-0 flex h-[100svh] min-h-[580px] flex-col items-center justify-between border-b border-white/10 bg-black px-4 py-8 sm:py-10 md:py-12">
        {/* Three.js Motion Canvas (Particles) in the background */}
        <div ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

        {/* Replaced axis with large subtle aDOPE logo watermark in the center */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none flex items-center justify-center opacity-15">
          <img
            src={LOGO_URL}
            alt="aDOPE watermark"
            className="h-auto w-[min(76vw,680px)] max-h-[54vh] object-contain filter invert drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Ambient radial lighting */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(255,255,255,0.05),transparent_68%)]" />

        {/* Text — enters from top-left, stops at top-middle with aDOPE logo positioned behind MEET THE TEAM */}
        <motion.div
          className="relative z-20 flex w-full flex-col items-center justify-center text-center"
          style={reduceMotion ? undefined : { x: copyX, y: copyY }}
        >
          {/* aDOPE Logo positioned directly behind MEET THE TEAM */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none opacity-20">
            <img
              src={LOGO_URL}
              alt="aDOPE logo watermark"
              className="h-28 w-auto max-w-[280px] sm:h-36 sm:max-w-[400px] object-contain filter invert drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]"
            />
          </div>

          <span className="relative z-10 mb-2 block font-mono text-[9px] uppercase tracking-[0.21em] text-neutral-400 sm:text-[10px]">
            03 // The Collective · Made Together
          </span>
          <h2 className="relative z-10 text-[clamp(2.5rem,6.2vw,5.8rem)] font-extrabold uppercase leading-none tracking-[-0.06em] text-white">
            MEET THE TEAM
          </h2>
        </motion.div>

        {/* Photo Stage with circular orbiting grayscale tool logos around it */}
        <motion.div
          className="relative z-10 mx-auto flex max-h-[66vh] w-full max-w-[840px] items-center justify-center"
          style={reduceMotion ? undefined : { x: frameX, y: frameY }}
          onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(clubPhotoId)}
          onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(clubPhotoId)}
          onClick={() => window.matchMedia('(hover: none)').matches && onImageEnter(clubPhotoId)}
        >
          {/* Circular Orbiting Logos (Continuous circular motion around the photo, in grayscale, NO text below) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {TOOL_LOGOS.map((logo, index) => {
              // 5 equidistant angles along the circular orbit
              const angle = orbitAngle + (index * 2 * Math.PI) / TOOL_LOGOS.length;
              const rx = typeof window !== 'undefined' && window.innerWidth < 640 ? 170 : 440;
              const ry = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 250;
              const x = Math.cos(angle) * rx;
              const y = Math.sin(angle) * ry;
              const depth = (Math.sin(angle) + 1) / 2;
              const scale = 0.85 + depth * 0.28;
              const opacity = 0.4 + depth * 0.52;
              const zIndex = depth > 0.5 ? 25 : 5;

              return (
                <div
                  key={logo.name}
                  className="pointer-events-auto absolute transition-transform duration-75 ease-out select-none"
                  style={{
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`,
                    opacity,
                    zIndex,
                  }}
                >
                  <div className="group relative flex items-center justify-center rounded-2xl border border-white/15 bg-black/75 p-2.5 sm:p-3 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-125 hover:border-white/50 hover:bg-black/95">
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-white/5 blur-lg transition-all duration-300 group-hover:bg-white/20 group-hover:blur-xl" />
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-9 w-9 sm:h-13 sm:w-13 object-contain transition-all duration-300"
                      style={{
                        filter: 'grayscale(100%) contrast(1.15) brightness(0.9)',
                      }}
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
            className="block h-auto max-h-[66vh] w-auto max-w-full rounded border border-white/15 object-contain shadow-2xl transition-all duration-300"
            style={{
              filter: isHighlighted ? 'none' : 'grayscale(0.4) contrast(1.05)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

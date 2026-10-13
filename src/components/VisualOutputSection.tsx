import React, { useEffect, useRef, useState } from 'react';
import { ARTWORKS_DATA } from '../data/mockData';
import { Artwork } from '../types';
import { Eye } from 'lucide-react';
import * as THREE from 'three';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';

const NirvanaPhoenix: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 8.2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const emblem = new THREE.Group();
    scene.add(emblem);
    const texture = new THREE.TextureLoader().load('/nirvana-phoenix.png', (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.generateMipmaps = true;
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
      loaded.needsUpdate = true;
      const image = loaded.image as HTMLImageElement;
      const aspect = image.width / image.height;
      const height = 4.15;
      const width = height * aspect;

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: loaded, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
      );
      // Layer the transparent phoenix silhouette to give the mark a restrained, hand-rotatable edge.
      for (let layer = 0; layer < 5; layer += 1) {
        const side = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          new THREE.MeshBasicMaterial({
            map: loaded,
            color: 0x733b16,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
          })
        );
        side.position.z = -0.13 + layer * 0.022;
        side.position.x = -0.045;
        side.position.y = -0.04;
        emblem.add(side);
      }
      face.position.z = 0.015;
      emblem.add(face);
      emblem.position.y = 0.25;
      renderer.render(scene, camera);
    });

    let dragging = false;
    let moved = false;
    let suppressClick = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let frameId = 0;
    let isVisible = false;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      mount.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 1) moved = true;
      velocityY = deltaX * 0.008;
      velocityX = deltaY * 0.008;
      emblem.rotation.y += velocityY;
      emblem.rotation.x += velocityX;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (mount.hasPointerCapture(event.pointerId)) mount.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 100);
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    };
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    const animate = () => {
      if (!isVisible) return;
      frameId = window.requestAnimationFrame(animate);
      if (!dragging) {
        emblem.rotation.x += velocityX;
        emblem.rotation.y += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;
      }
      renderer.render(scene, camera);
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !frameId) frameId = window.requestAnimationFrame(animate);
      if (!isVisible && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    });
    visibilityObserver.observe(mount);

    return () => {
      window.cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      mount.removeEventListener('click', onClick);
      texture.dispose();
      emblem.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing" aria-label="Drag to rotate the three-dimensional phoenix emblem for NIRVANA 2026" />;
};

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
  onSelectArtwork
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const routeMarkerRef = useRef<SVGCircleElement>(null);
  const routeGlowRef = useRef<SVGCircleElement>(null);
  const routePulseRef = useRef<SVGCircleElement>(null);
  const [route, setRoute] = useState({ width: 0, height: 0, d: '', masks: [] as { x: number; y: number; width: number; height: number }[] });
  const [activeStop, setActiveStop] = useState(1);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 75%', 'end 25%'] });
  const drawProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.32 });

  useMotionValueEvent(drawProgress, 'change', (progress) => {
    const path = routePathRef.current;
    const marker = routeMarkerRef.current;
    const glow = routeGlowRef.current;
    const pulse = routePulseRef.current;
    if (path && marker && glow && pulse) {
      const point = path.getPointAtLength(Math.min(1, Math.max(0, progress)) * path.getTotalLength());
      marker.setAttribute('cx', String(point.x));
      marker.setAttribute('cy', String(point.y));
      glow.setAttribute('cx', String(point.x));
      glow.setAttribute('cy', String(point.y));
      pulse.setAttribute('cx', String(point.x));
      pulse.setAttribute('cy', String(point.y));
    }
    setActiveStop(Math.min(9, Math.floor(Math.min(0.999, progress) * 9) + 1));
  });

  useEffect(() => {
    const path = routePathRef.current;
    const marker = routeMarkerRef.current;
    const glow = routeGlowRef.current;
    const pulse = routePulseRef.current;
    if (!route.d || !path || !marker || !glow || !pulse) return;
    const point = path.getPointAtLength(drawProgress.get() * path.getTotalLength());
    marker.setAttribute('cx', String(point.x));
    marker.setAttribute('cy', String(point.y));
    glow.setAttribute('cx', String(point.x));
    glow.setAttribute('cy', String(point.y));
    pulse.setAttribute('cx', String(point.x));
    pulse.setAttribute('cy', String(point.y));
  }, [route.d, drawProgress]);

  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;
    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = collage.getBoundingClientRect();
        const stops = Array.from(collage.querySelectorAll<HTMLElement>('[data-archive-stop]'));
        if (!bounds.width || !bounds.height || stops.length < 2) return;
        const points = stops.map((stop) => {
          const rect = stop.getBoundingClientRect();
          return { x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 };
        });
        const masks = Array.from(collage.querySelectorAll<HTMLElement>('[data-archive-mask]')).map((tile) => {
          const rect = tile.getBoundingClientRect();
          return { x: rect.left - bounds.left, y: rect.top - bounds.top, width: rect.width, height: rect.height };
        });
        const d = points.slice(1).reduce((path, point, index) => {
          const previous = points[index];
          const dx = point.x - previous.x;
          const dy = point.y - previous.y;
          const bend = Math.min(90, Math.max(-90, dx * 0.18));
          const c1x = previous.x + dx * 0.38 + bend;
          const c1y = previous.y + dy * 0.32;
          const c2x = point.x - dx * 0.38 + bend;
          const c2y = point.y - dy * 0.32;
          return `${path} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${point.x} ${point.y}`;
        }, `M ${points[0].x} ${points[0].y}`);
        setRoute({ width: bounds.width, height: bounds.height, d, masks });
      });
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(collage);
    collage.querySelectorAll<HTMLElement>('[data-archive-stop]').forEach((stop) => resizeObserver.observe(stop));
    collage.querySelectorAll<HTMLElement>('[data-archive-mask]').forEach((tile) => resizeObserver.observe(tile));
    window.addEventListener('resize', measure);
    measure();
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="py-16 sm:py-24 lg:py-32 bg-[#131313] relative z-20 border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-5 sm:gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
              Gallery
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-none tracking-tight text-white">
              Design<br />
              Archive
            </h2>
          </div>

            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">{ARTWORKS_DATA.length} Projects</span>
              <span className="border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">Route {String(activeStop).padStart(2, '0')} / 09</span>
            </div>
        </div>

        <div ref={collageRef} className="relative grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
          {route.d && <svg className="pointer-events-none absolute inset-0 z-[15] h-full w-full overflow-visible mix-blend-difference" viewBox={`0 0 ${route.width} ${route.height}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <mask id="archive-route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={route.width} height={route.height}>
                <rect width={route.width} height={route.height} fill="white" />
                {route.masks.map((mask, index) => <rect key={index} x={mask.x} y={mask.y} width={mask.width} height={mask.height} fill="black" />)}
              </mask>
            </defs>
            <motion.path ref={routePathRef} d={route.d} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" mask="url(#archive-route-mask)" style={{ pathLength: drawProgress, filter: 'drop-shadow(0 0 3px rgba(255,255,255,.42))' }} />
            <g mask="url(#archive-route-mask)">
              <circle ref={routeGlowRef} cx="0" cy="0" r="8" fill="rgba(255,255,255,.4)" />
              <circle ref={routeMarkerRef} cx="0" cy="0" r="4.5" fill="#fff" />
              <circle ref={routePulseRef} cx="0" cy="0" r="4.5" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="1">
                <animate attributeName="r" values="5;11;5" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".9;.08;.9" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>}
          {ARTWORKS_DATA.slice(0, 1).map((art) => <ArchiveArtwork key={art.id} stopIndex={0} art={art} className="z-10 md:col-span-7 md:-rotate-1 md:translate-y-4" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}

          <ArchiveNote stopIndex={1} className="z-10 md:col-span-4 md:col-start-9 md:mt-20" number="01" eyebrow="Campus culture" title="Made for the moments everyone remembers." />

          {ARTWORKS_DATA.slice(1, 2).map((art) => <ArchiveArtwork key={art.id} stopIndex={2} art={art} className="z-10 md:col-span-4 md:col-start-9 md:rotate-1 md:-mt-4" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}

          {ARTWORKS_DATA.slice(2, 3).map((art) => <ArchiveArtwork key={art.id} stopIndex={3} art={art} className="z-10 md:col-span-5 md:col-start-6 md:-rotate-1 md:-mt-12" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}

          <ArchiveNote stopIndex={4} className="z-10 md:col-span-3 md:col-start-2 md:mt-16" number="02" eyebrow="The aDOPE practice" title="Good ideas get better together." />

          {ARTWORKS_DATA.slice(3, 4).map((art) => <ArchiveArtwork key={art.id} stopIndex={5} art={art} className="z-10 md:col-span-4 md:col-start-1 md:rotate-1 md:mt-4" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}

          <ArchiveNote stopIndex={6} className="z-10 md:col-span-4 md:col-start-5 md:mt-16" number="03" eyebrow="Design archive" title="Built with intention. Made to be seen." />

          {ARTWORKS_DATA.slice(4, 5).map((art) => <ArchiveArtwork key={art.id} stopIndex={7} art={art} className="z-10 md:col-span-4 md:col-start-9 md:rotate-1 md:-mt-8" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}

          {ARTWORKS_DATA.slice(5).map((art) => <ArchiveArtwork key={art.id} stopIndex={8} art={art} className="z-10 md:col-span-6 md:col-start-4 md:-rotate-1 md:mt-8" highlightedImageId={highlightedImageId} onImageEnter={onImageEnter} onImageLeave={onImageLeave} onSelectArtwork={onSelectArtwork} />)}
        </div>
      </div>
    </section>
  );
};

interface ArchiveArtworkProps {
  art: Artwork;
  stopIndex: number;
  className: string;
  highlightedImageId: string | null;
  onImageEnter: (imageId: string) => void;
  onImageLeave: (imageId: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
}

const ArchiveArtwork: React.FC<ArchiveArtworkProps> = ({ art, stopIndex, className, highlightedImageId, onImageEnter, onImageLeave, onSelectArtwork }) => {
  const imageId = `work-${art.id}`;
  const isHighlighted = highlightedImageId === imageId;
  const aspect = art.id === 'art-nirvana-2026' ? 'aspect-[1.18]' : art.id === 'art-2' ? 'aspect-[4/5]' : 'aspect-[1.18]';

  return (
    <motion.article
      data-archive-stop={stopIndex}
      data-archive-mask=""
      onPointerEnter={() => window.matchMedia('(hover: hover)').matches && onImageEnter(imageId)}
      onPointerLeave={() => window.matchMedia('(hover: hover)').matches && onImageLeave(imageId)}
      onClick={() => {
        if (window.matchMedia('(hover: none)').matches && !isHighlighted) { onImageEnter(imageId); return; }
        onSelectArtwork(art);
      }}
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay: (stopIndex % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`${className} group relative min-w-0 cursor-pointer`}
    >
      <div className={`${aspect} relative isolate overflow-hidden bg-[#171717] transition duration-700 group-hover:-translate-y-1`}>
        {art.id === 'art-nirvana-2026' ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,94,20,0.2),transparent_58%)]" />
            <div className="absolute inset-0"><NirvanaPhoenix /></div>
            <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.28em] text-amber-100/55">Drag to rotate</div>
          </>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center transition duration-700" style={{ backgroundImage: `url('${art.imageUrl}')`, filter: isHighlighted ? 'none' : 'grayscale(1)', opacity: isHighlighted ? 1 : 0.76, mixBlendMode: isHighlighted ? 'normal' : 'luminosity', transform: isHighlighted ? 'scale(1.045)' : 'scale(1)' }} />
        )}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 transition-opacity ${isHighlighted ? 'opacity-70' : 'opacity-90'}`} />
        <span className="absolute left-3 top-3 z-10 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/85 backdrop-blur-sm">{art.category}</span>
        <span className="absolute right-3 top-3 z-10 text-white opacity-0 transition-opacity group-hover:opacity-100"><Eye className="h-4 w-4" /></span>
        <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-5 sm:left-5">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-white/60">{art.artistName} · {art.year}</span>
          <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{art.title}</h3>
        </div>
      </div>
    </motion.article>
  );
};

const ArchiveNote: React.FC<{ className: string; number: string; eyebrow: string; title: string; stopIndex: number }> = ({ className, number, eyebrow, title, stopIndex }) => (
  <motion.div data-archive-mask="" initial={{ opacity: 0, filter: 'blur(8px)' }} whileInView={{ opacity: 1, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.75, delay: (stopIndex % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }} className={`${className} relative flex min-h-[210px] flex-col justify-between bg-[#e9e6dd] p-4 text-[#171715] sm:min-h-[260px] sm:p-8`}>
    <span data-archive-stop={stopIndex} aria-hidden="true" className="absolute -bottom-4 -left-4 h-px w-px" />
    <div className="flex items-start justify-between gap-4">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50">{eyebrow}</span>
      <span className="font-mono text-[10px] text-black/35">{number}</span>
    </div>
    <p className="max-w-[13ch] text-xl font-semibold uppercase leading-[0.98] tracking-[-0.06em] sm:text-3xl">{title}</p>
    <span className="h-px w-10 bg-black/40" />
  </motion.div>
);

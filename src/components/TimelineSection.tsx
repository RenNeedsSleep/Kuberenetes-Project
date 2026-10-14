import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import * as THREE from 'three';
import { TIMELINE_DATA } from '../data/mockData';

// A compact, Silverstone-inspired GP route, laid into a shallow 3D plane.
const SILVERSTONE_POINTS: [number, number, number][] = [
  [0, -2.75, 0], [-0.75, -2.42, 0.04], [-1.48, -1.72, 0.08],
  [-1.4, -0.95, 0.12], [-0.9, -0.25, 0.18], [-1.35, 0.45, 0.22],
  [-1.8, 1.08, 0.25], [-2.38, 1.4, 0.28], [-3.28, 1.08, 0.31],
  [-4.02, 0.42, 0.25], [-3.48, -0.26, 0.2], [-3.05, -0.52, 0.16],
  [-4.15, -0.72, 0.13], [-4.42, -0.1, 0.14], [-4.3, 1.38, 0.2],
  [-3.75, 2.32, 0.27], [-2.75, 2.78, 0.32], [-1.86, 2.52, 0.35],
  [-1.1, 2.74, 0.38], [-0.56, 2.03, 0.4], [0.45, 1.04, 0.38],
  [1.68, -0.12, 0.3], [2.63, -0.96, 0.2], [3.2, -1.7, 0.12],
  [2.65, -2.16, 0.08], [1.72, -2.38, 0.05], [0.82, -2.68, 0.03],
  [0, -2.75, 0],
];

// 11 checkpoints corresponding to each milestone date from 2020 to 2026
const CHECKPOINT_PROGRESS = [
  0.03, // 01: Feb 2020 - Club Officially Starts
  0.12, // 02: 6 Mar 2020 - Nirvana 2020 Poster
  0.21, // 03: 1 Apr 2022 - Design Seminar by Abhishek
  0.31, // 04: 29 Jun 2022 - Nirvana 2022
  0.40, // 05: 6 Apr 2023 - Resolution 2.0 Workshop
  0.50, // 06: 27 Apr 2023 - Nirvana 2023
  0.60, // 07: 22 Dec 2023 - Design Dynasty Workshop
  0.70, // 08: 15 Mar 2024 - Nirvana 2024 Logo
  0.79, // 09: 23 Mar 2025 - Nirvana 2025 Logo
  0.88, // 10: 14 Oct 2025 - Video Editing Workshop
  0.96, // 11: 23 Feb 2026 - Nirvana 2026 3D Mark
];

interface TrackSceneApi {
  setProgress: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
}

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const trackApiRef = useRef<TrackSceneApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const easedProgress = useSpring(scrollYProgress, { stiffness: 95, damping: 25, mass: 0.3 });

  useMotionValueEvent(easedProgress, 'change', (progress) => {
    trackApiRef.current?.setProgress(progress);
    let nextIndex = 0;
    for (let i = 0; i < CHECKPOINT_PROGRESS.length; i++) {
      const prev = i === 0 ? 0 : CHECKPOINT_PROGRESS[i - 1];
      const cur = CHECKPOINT_PROGRESS[i];
      const threshold = (prev + cur) / 2;
      if (progress >= threshold) {
        nextIndex = i;
      }
    }
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  const handleJumpToCheckpoint = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const progress = CHECKPOINT_PROGRESS[index];
    const totalScroll = section.offsetHeight - window.innerHeight;
    const targetY = section.offsetTop + totalScroll * progress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

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
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.up.set(0, 1, 0);
    camera.position.set(-0.6, -2.6, 11.8);
    camera.lookAt(-0.6, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const points = SILVERSTONE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.12);
    const road = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 280, 0.17, 7, true),
      new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.85, metalness: 0.08 })
    );
    scene.add(road);
    const outlineCurve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(point.x, point.y, point.z + 0.18)), true, 'catmullrom', 0.12
    );
    const circuitOutline = new THREE.Mesh(
      new THREE.TubeGeometry(outlineCurve, 320, 0.018, 5, true),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
    );
    scene.add(circuitOutline);

    const route = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    scene.add(route);

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const markerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
    );
    scene.add(marker, markerGlow);

    // Create 11 checkpoint nodes along the 3D track
    const checkpointMeshes = CHECKPOINT_PROGRESS.map((at, index) => {
      const group = new THREE.Group();
      group.position.copy(curve.getPointAt(at));
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.018, 4, 18),
        new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.65 })
      );
      ring.position.z += 0.12;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
      );
      dot.position.z += 0.12;

      // Checkpoint numeric badge (01, 02 ... 11)
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 96;
      badgeCanvas.height = 96;
      const context = badgeCanvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.font = '700 52px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(index + 1).padStart(2, '0'), 48, 48);
      }
      const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
      const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTexture, transparent: true, depthTest: false }));
      badge.scale.set(0.32, 0.32, 1);
      badge.position.set(group.position.x >= 0 ? 0.28 : -0.28, 0.24, 0.44);
      group.add(ring, dot, badge);
      scene.add(group);
      return { ring, dot, badge };
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-3, 2, 8);
    scene.add(keyLight);

    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.x = -0.6;
      camera.position.z = width < 500 ? 11.8 : 9.8;
      camera.lookAt(-0.6, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let previousRouteGeometry: THREE.BufferGeometry | null = null;
    let currentProgress = 0;
    const setProgress = (value: number) => {
      currentProgress = THREE.MathUtils.clamp(value, 0, 1);
      const samples = Math.max(2, Math.ceil(280 * currentProgress));
      const routePoints = Array.from({ length: samples + 1 }, (_, index) => {
        const point = curve.getPointAt(currentProgress * index / samples);
        return new THREE.Vector3(point.x, point.y, point.z + 0.19);
      });
      const nextGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
      if (previousRouteGeometry) previousRouteGeometry.dispose();
      route.geometry = nextGeometry;
      previousRouteGeometry = nextGeometry;
      const position = curve.getPointAt(currentProgress);
      marker.position.copy(position);
      marker.position.z += 0.29;
      markerGlow.position.copy(marker.position);

      checkpointMeshes.forEach(({ ring, dot, badge }, index) => {
        const isReached = currentProgress >= CHECKPOINT_PROGRESS[index] - 0.02;
        const isActive = Math.abs(currentProgress - CHECKPOINT_PROGRESS[index]) < 0.045;
        const color = isActive ? 0xffffff : isReached ? 0xcccccc : 0x555555;
        (ring.material as THREE.MeshBasicMaterial).color.setHex(color);
        (dot.material as THREE.MeshBasicMaterial).color.setHex(isActive ? 0xffffff : isReached ? 0xdddddd : 0x777777);
        badge.material.opacity = isActive ? 1 : isReached ? 0.75 : 0.4;
      });
      render();
    };

    trackApiRef.current = { setProgress, resize, dispose: () => {
      resizeObserver.disconnect();
      road.geometry.dispose(); (road.material as THREE.Material).dispose();
      circuitOutline.geometry.dispose(); (circuitOutline.material as THREE.Material).dispose();
      route.geometry.dispose(); (route.material as THREE.Material).dispose();
      marker.geometry.dispose(); (marker.material as THREE.Material).dispose();
      markerGlow.geometry.dispose(); (markerGlow.material as THREE.Material).dispose();
      checkpointMeshes.forEach(({ ring, dot, badge }) => {
        ring.geometry.dispose(); (ring.material as THREE.Material).dispose();
        dot.geometry.dispose(); (dot.material as THREE.Material).dispose();
        badge.material.map?.dispose(); badge.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      trackApiRef.current = null;
    } };
    resize();
    setProgress(currentProgress);

    return () => trackApiRef.current?.dispose();
  }, []);

  return (
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[280svh] bg-black md:h-[340svh]">
      <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden bg-black border-y border-white/10">
        <div className="mx-auto flex h-full w-full max-w-[1260px] flex-col justify-between px-4 pb-4 pt-16 sm:px-8 sm:pb-6 sm:pt-20 lg:px-16">
          <header className="mb-2 flex items-end justify-between gap-4 sm:mb-4">
            <div className="md:-translate-x-6">
              <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-400 sm:text-[10px]">
                04 / The aDOPE archive · MGIT, Hyderabad
              </span>
              <h2 className="text-2xl font-extrabold uppercase tracking-[-0.06em] text-white sm:text-4xl">
                History in motion
              </h2>
            </div>
            <div className="hidden text-right font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 sm:block">
              Silverstone Circuit · 11 Milestones
            </div>
          </header>

          <div className="mx-auto grid w-full max-w-[1080px] flex-1 items-center gap-4 md:grid-cols-[1.05fr_.95fr] md:gap-8 min-h-0">
            {/* 3D Track View */}
            <div className="flex flex-col justify-center">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-400 sm:mb-2 sm:text-[9px]">
                <span>Scroll to drive the archive</span>
                <span className="text-white font-semibold">Checkpoint {String(activeIndex + 1).padStart(2, '0')} / 11</span>
              </div>
              <div
                ref={canvasRef}
                className="h-[34svh] min-h-[180px] max-h-[360px] w-full overflow-hidden bg-black border border-white/10 sm:h-[40svh] sm:min-h-[270px] sm:max-h-[440px]"
                role="img"
                aria-label="A 3D Silverstone circuit tracking 11 milestones across 2020 to 2026. Scroll to move the marker along the track."
              />
            </div>

            {/* Milestone Pop-up Card */}
            <div className="relative min-h-[190px] sm:min-h-[240px]" aria-live="polite">
              <div className="absolute inset-x-2 top-2 bottom-0 translate-y-2 border border-white/5 bg-white/[0.015] sm:inset-x-3 sm:top-3" />
              <div className="absolute inset-x-1 top-1 bottom-1 translate-y-1 border border-white/10 bg-black sm:inset-x-1.5 sm:top-1.5" />
              <AnimatePresence mode="wait" initial={false}>
                {TIMELINE_DATA.map((item, index) => index === activeIndex && (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    aria-current="step"
                    className="relative z-10 flex min-h-[190px] flex-col justify-between border border-white/20 bg-black p-4 sm:min-h-[240px] sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  >
                    <div>
                      {/* Top Bar: Era + Date Badge */}
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 font-mono text-[8px] uppercase tracking-[0.14em] sm:text-[9px]">
                        <span className="text-neutral-400 font-medium">{item.version}</span>
                        <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5 font-bold tracking-widest text-white">
                          {item.date}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mb-2 text-lg font-extrabold uppercase leading-snug tracking-[-0.04em] text-white sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-neutral-300 sm:text-sm">
                        {item.description}
                      </p>

                      {/* Bullet Takeaways */}
                      {item.fullDetails && item.fullDetails.length > 0 && (
                        <ul className="mt-3 space-y-1 text-[10px] leading-relaxed text-neutral-400 sm:text-xs">
                          {item.fullDetails.slice(0, 2).map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Bottom Status */}
                    <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[9px]">
                      <span>Phase / {item.category}</span>
                      <span className="text-white">NODE {String(index + 1).padStart(2, '0')} OF 11</span>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Checkpoint Bar: All 11 dates clickable */}
          <div className="mx-auto w-full max-w-[1080px] pt-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {TIMELINE_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleJumpToCheckpoint(idx)}
                  className={`flex shrink-0 items-center gap-1.5 rounded border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] transition-all sm:text-[8px] ${
                    idx === activeIndex
                      ? 'border-white bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                      : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className={idx === activeIndex ? 'text-black' : 'text-neutral-500'}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{item.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

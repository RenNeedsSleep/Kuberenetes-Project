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

const CHECKPOINT_PROGRESS = [0.04, 0.48, 0.83];

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
    const nextIndex = progress < CHECKPOINT_PROGRESS[1] ? 0 : progress < CHECKPOINT_PROGRESS[2] ? 1 : 2;
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.up.set(0, 1, 0);
    camera.position.set(-0.6, -2.6, 11.8);
    camera.lookAt(-0.6, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
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
      new THREE.TubeGeometry(curve, 260, 0.17, 7, true),
      new THREE.MeshStandardMaterial({ color: 0x292929, roughness: 0.82, metalness: 0.08 })
    );
    scene.add(road);
    const outlineCurve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(point.x, point.y, point.z + 0.18)), true, 'catmullrom', 0.12
    );
    const circuitOutline = new THREE.Mesh(
      new THREE.TubeGeometry(outlineCurve, 320, 0.018, 5, true),
      new THREE.MeshBasicMaterial({ color: 0xd8d8d8, transparent: true, opacity: 0.92 })
    );
    scene.add(circuitOutline);

    const route = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    scene.add(route);

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const markerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })
    );
    scene.add(marker, markerGlow);

    const checkpointMeshes = CHECKPOINT_PROGRESS.map((at, index) => {
      const group = new THREE.Group();
      group.position.copy(curve.getPointAt(at));
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.15, 0.018, 4, 18),
        new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.65 })
      );
      ring.position.z += 0.12;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xbdbdbd })
      );
      dot.position.z += 0.12;
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 96;
      badgeCanvas.height = 96;
      const context = badgeCanvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.font = '700 64px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String.fromCharCode(65 + index), 48, 48);
      }
      const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
      const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTexture, transparent: true, depthTest: false }));
      badge.scale.set(0.34, 0.34, 1);
      badge.position.set(group.position.x >= 0 ? 0.28 : -0.28, 0.25, 0.46);
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
      const samples = Math.max(2, Math.ceil(260 * currentProgress));
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
      checkpointMeshes.forEach(({ ring, dot }, index) => {
        const isReached = currentProgress >= CHECKPOINT_PROGRESS[index];
        const color = isReached ? 0xffffff : 0x777777;
        (ring.material as THREE.MeshBasicMaterial).color.setHex(color);
        (dot.material as THREE.MeshBasicMaterial).color.setHex(isReached ? 0xffffff : 0xa5a5a5);
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
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[155svh] bg-[#0c0c0c] md:h-[175svh]">
      <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden border-y border-white/[0.06]">
        <div className="mx-auto w-full max-w-[1260px] px-4 pb-3 pt-[4.5rem] sm:px-8 sm:pb-8 sm:pt-20 lg:px-16">
          <header className="mb-3 flex items-end justify-between gap-4 sm:mb-6">
            <div className="md:-translate-x-6">
              <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-500 sm:text-[10px]">04 / The aDOPE archive · MGIT, Hyderabad</span>
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.055em] text-white sm:text-4xl">History in motion</h2>
            </div>
            <div className="hidden text-right font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 sm:block">Silverstone GP · 5.890 km</div>
          </header>

          <div className="mx-auto grid w-full max-w-[1080px] items-center gap-3 md:grid-cols-[1.08fr_.92fr] md:gap-8">
            <div>
              <div className="mb-1 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 sm:mb-2 sm:text-[9px]">
                <span>Silverstone circuit · scroll to drive the archive</span><span className="text-white">A → B → C</span>
              </div>
              <div ref={canvasRef} className="h-[39svh] min-h-[190px] max-h-[390px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.065),transparent_70%)] sm:h-[45svh] sm:min-h-[300px] sm:max-h-[500px]" role="img" aria-label="A 3D Silverstone-inspired circuit connecting three aDOPE milestones, labeled A, B, and C. Scroll to move the marker along the track." />
            </div>

            <div className="relative min-h-[116px] sm:min-h-[176px]" aria-live="polite">
              <div className="absolute inset-x-2 top-2 bottom-0 translate-y-2 border border-white/10 bg-white/[0.025] sm:inset-x-3 sm:top-3" />
              <div className="absolute inset-x-1 top-1 bottom-1 translate-y-1 border border-white/15 bg-[#111] sm:inset-x-1.5 sm:top-1.5" />
              <AnimatePresence mode="wait" initial={false}>
                {TIMELINE_DATA.map((item, index) => index === activeIndex && (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, x: 28, y: 9, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -18, y: -5, scale: 0.985 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    aria-current="step"
                    className="relative z-10 flex min-h-[116px] flex-col justify-between border border-white/30 bg-[#151515] p-3 sm:min-h-[176px] sm:p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[7px] uppercase tracking-[0.12em] text-neutral-500 sm:text-[9px] sm:tracking-[0.14em]">
                      <span>{String(index + 1).padStart(2, '0')} / {item.category}</span>
                      <span className="text-white">Checkpoint {String.fromCharCode(65 + index)}</span>
                    </div>
                    <div>
                      <h3 className="mb-1 text-base font-medium leading-snug tracking-[-0.02em] text-white sm:text-xl">{item.title}</h3>
                      <p className="max-w-[44ch] text-[10px] leading-relaxed text-neutral-400 sm:text-xs">{item.description}</p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-full max-w-[1080px] items-center gap-2 font-mono text-[7px] uppercase tracking-[0.17em] text-neutral-600 sm:mt-3 sm:text-[8px]">
            <span className="h-px w-7 bg-white/70" />Progress {String(activeIndex + 1).padStart(2, '0')} <span className="text-neutral-700">/</span> {String(TIMELINE_DATA.length).padStart(2, '0')}
            </div>
        </div>
      </div>
    </section>
  );
};

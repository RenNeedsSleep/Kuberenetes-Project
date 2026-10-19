import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMELINE_DATA } from '../data/mockData';
import { TimelineLog } from '../types';
import { createPortal } from 'react-dom';

gsap.registerPlugin(ScrollTrigger);

// Silverstone-inspired GP route in a shallow 3D plane
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

interface Point2D {
  x: number;
  y: number;
}

interface TrackSceneApi {
  setProgress: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
}

// Procedural high-tech Web Audio synthesizer for Formula 1 engine & pit radio sound
class F1SoundEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gain: GainNode | null = null;
  private isMuted: boolean = true;
  private isRunning: boolean = false;
  private lastProgress: number = 0;
  private lastTime: number = Date.now();
  private decayTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      // Audio unsupported
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startEngine();
    } else {
      this.stopEngine();
    }
  }

  private startEngine() {
    if (!this.ctx || this.isRunning || this.isMuted) return;
    try {
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.filter = this.ctx.createBiquadFilter();
      this.gain = this.ctx.createGain();

      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(550, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3.2, this.ctx.currentTime);

      this.gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isRunning = true;
    } catch {
      // Ignore
    }
  }

  private stopEngine() {
    if (this.gain && this.ctx) {
      try {
        this.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      } catch {}
    }
    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.osc1?.disconnect();
        this.osc2?.disconnect();
        this.filter?.disconnect();
        this.gain?.disconnect();
      } catch {}
      this.isRunning = false;
      this.osc1 = null;
      this.osc2 = null;
      this.filter = null;
      this.gain = null;
    }, 120);
  }

  public updateScroll(progress: number) {
    if (this.isMuted || !this.ctx || !this.isRunning || !this.gain || !this.osc1 || !this.osc2 || !this.filter) return;

    const now = Date.now();
    const dt = Math.max(0.016, (now - this.lastTime) / 1000);
    const delta = Math.abs(progress - this.lastProgress);
    const speed = delta / dt;

    this.lastProgress = progress;
    this.lastTime = now;

    const normalizedSpeed = Math.min(speed / 0.6, 1.0);
    const targetFreq = 110 + normalizedSpeed * 380;
    const targetGain = 0.03 + normalizedSpeed * 0.14;
    const targetFilter = 500 + normalizedSpeed * 1800;

    const t = this.ctx.currentTime;
    try {
      this.osc1.frequency.setTargetAtTime(targetFreq, t, 0.08);
      this.osc2.frequency.setTargetAtTime(targetFreq * 1.5, t, 0.08);
      this.filter.frequency.setTargetAtTime(targetFilter, t, 0.08);
      this.gain.gain.setTargetAtTime(targetGain, t, 0.08);
    } catch {}

    if (this.decayTimer) clearTimeout(this.decayTimer);
    this.decayTimer = window.setTimeout(() => {
      if (!this.ctx || !this.isRunning || !this.gain || !this.osc1) return;
      const decayT = this.ctx.currentTime;
      try {
        this.osc1.frequency.setTargetAtTime(110, decayT, 0.25);
        this.osc2?.frequency.setTargetAtTime(165, decayT, 0.25);
        this.filter?.frequency.setTargetAtTime(500, decayT, 0.25);
        this.gain.gain.setTargetAtTime(0.02, decayT, 0.25);
      } catch {}
    }, 180);
  }

  public playCheckpointBeep() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const t = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1320, t + 0.04);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch {}
  }

  public dispose() {
    this.stopEngine();
    if (this.decayTimer) clearTimeout(this.decayTimer);
    try {
      this.ctx?.close();
    } catch {}
    this.ctx = null;
  }
}

// Sleek, futuristic directional 3D Arrow Head navigating the Silverstone track
function createArrowHead(scene: THREE.Scene) {
  const arrowGroup = new THREE.Group();

  // Sharp sleek chevron / arrowhead shape
  const shape = new THREE.Shape();
  // Forward apex pointing along +X in direction of motion
  shape.moveTo(0.24, 0);
  // Right wing tip
  shape.lineTo(-0.16, -0.16);
  // Right inner notch barb
  shape.lineTo(-0.08, -0.06);
  // Center notch
  shape.lineTo(-0.04, 0);
  // Left inner notch barb
  shape.lineTo(-0.08, 0.06);
  // Left wing tip
  shape.lineTo(-0.16, 0.16);
  shape.closePath();

  const extrudeSettings = {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.014,
    bevelThickness: 0.014,
  };

  const arrowGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  arrowGeo.center();

  // Polished illuminated stark white metallic material with emissive glow
  const arrowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.88,
    roughness: 0.1,
    metalness: 0.95,
  });

  const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
  arrowGroup.add(arrowMesh);

  // Sharp apex glowing tip accent
  const tipGeo = new THREE.ConeGeometry(0.04, 0.14, 4);
  tipGeo.rotateZ(-Math.PI / 2);
  const tipMesh = new THREE.Mesh(
    tipGeo,
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  tipMesh.position.set(0.12, 0, 0.025);
  arrowGroup.add(tipMesh);

  // Luminous ground-effect radial aura beneath the arrow on the asphalt
  const auraCanvas = document.createElement('canvas');
  auraCanvas.width = 64;
  auraCanvas.height = 64;
  const actx = auraCanvas.getContext('2d');
  if (actx) {
    const grad = actx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    actx.fillStyle = grad;
    actx.fillRect(0, 0, 64, 64);
  }
  const auraTex = new THREE.CanvasTexture(auraCanvas);
  const auraMat = new THREE.MeshBasicMaterial({
    map: auraTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const aura = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), auraMat);
  aura.position.set(0, 0, -0.012);
  arrowGroup.add(aura);

  scene.add(arrowGroup);

  return {
    arrowGroup,
    arrowMesh,
    dispose: () => {
      arrowGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      auraTex.dispose();
      scene.remove(arrowGroup);
    },
  };
}

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const trackApiRef = useRef<TrackSceneApi | null>(null);
  const soundEngineRef = useRef<F1SoundEngine | null>(null);
  const activeIndexRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineLog | null>(null);
  const [checkpointCoords, setCheckpointCoords] = useState<Point2D[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Initialize sound engine on mount
  useEffect(() => {
    const engine = new F1SoundEngine();
    soundEngineRef.current = engine;
    return () => {
      engine.dispose();
      soundEngineRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    soundEngineRef.current?.setMuted(!nextState);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMilestone(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize scroll progress using GSAP ScrollTrigger for exact sync with Lenis
  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        trackApiRef.current?.setProgress(progress);
        soundEngineRef.current?.updateScroll(progress);

        // Compute active checkpoint
        let nextIndex = 0;
        for (let i = 0; i < CHECKPOINT_PROGRESS.length; i++) {
          const prev = i === 0 ? 0 : CHECKPOINT_PROGRESS[i - 1];
          const cur = CHECKPOINT_PROGRESS[i];
          const threshold = (prev + cur) / 2;
          if (progress >= threshold) {
            nextIndex = i;
          }
        }

        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
          soundEngineRef.current?.playCheckpointBeep();
        }
      },
    });

    return () => trigger.kill();
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.up.set(0, 1, 0);
    camera.position.set(-0.6, -2.6, 10.5);
    camera.lookAt(-0.6, 0, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.3 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const points = SILVERSTONE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.12);

    // Track asphalt surface
    const road = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 280, 0.18, 8, true),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85, metalness: 0.1 })
    );
    scene.add(road);

    // Track neon/white edge rails
    const outlineCurve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(point.x, point.y, point.z + 0.18)),
      true,
      'catmullrom',
      0.12
    );
    const circuitOutline = new THREE.Mesh(
      new THREE.TubeGeometry(outlineCurve, 320, 0.02, 6, true),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
    );
    scene.add(circuitOutline);

    // Dynamic animated scroll route (bright white line)
    const route = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    scene.add(route);

    // 3D Directional Arrow Head navigating the Silverstone Track
    const arrowHead = createArrowHead(scene);

    // 11 Checkpoint nodes placed directly on the 3D track
    const checkpointMeshes = CHECKPOINT_PROGRESS.map((at, index) => {
      const group = new THREE.Group();
      group.position.copy(curve.getPointAt(at));

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.022, 6, 20),
        new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.7 })
      );
      ring.position.z += 0.12;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
      );
      dot.position.z += 0.12;

      // Numeric sprite badge (01, 02 ... 11)
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 96;
      badgeCanvas.height = 96;
      const ctx = badgeCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1).padStart(2, '0'), 48, 48);
      }
      const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
      const badge = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: badgeTexture, transparent: true, depthTest: false })
      );
      badge.scale.set(0.34, 0.34, 1);
      badge.position.set(group.position.x >= 0 ? 0.32 : -0.32, 0.28, 0.44);

      group.add(ring, dot, badge);
      scene.add(group);
      return { ring, dot, badge };
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-3, 2, 8);
    scene.add(keyLight);

    const render = () => renderer.render(scene, camera);

    // Helper: calculate 2D pixel coordinates for all 11 checkpoints on the canvas
    const computeCheckpointCoords = (w: number, h: number) => {
      const coords = CHECKPOINT_PROGRESS.map((at) => {
        const pt = curve.getPointAt(at);
        const v = new THREE.Vector3(pt.x, pt.y, pt.z + 0.2);
        v.project(camera);
        return {
          x: (v.x * 0.5 + 0.5) * w,
          y: (-(v.y * 0.5) + 0.5) * h,
        };
      });
      setCheckpointCoords(coords);
      setContainerDimensions({ width: w, height: h });
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.position.x = -0.6;
      camera.position.z = width < 520 ? 13.0 : (width < 820 ? 11.2 : 9.6);
      camera.lookAt(-0.6, 0, 0);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      render();
      computeCheckpointCoords(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let previousRouteGeometry: THREE.BufferGeometry | null = null;
    let currentProgress = 0;

    const setProgress = (value: number) => {
      currentProgress = THREE.MathUtils.clamp(value, 0, 1);
      const samples = Math.max(2, Math.ceil(280 * currentProgress));
      const routePoints = Array.from({ length: samples + 1 }, (_, index) => {
        const point = curve.getPointAt((currentProgress * index) / samples);
        return new THREE.Vector3(point.x, point.y, point.z + 0.19);
      });

      const nextGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
      if (previousRouteGeometry) previousRouteGeometry.dispose();
      route.geometry = nextGeometry;
      previousRouteGeometry = nextGeometry;

      // Position and dynamically align Arrow Head along the track curve
      const position = curve.getPointAt(currentProgress);
      const tangent = curve.getTangentAt(currentProgress).normalize();

      // Arrow Head local coordinate system:
      // Forward = tangent (+X, apex pointing in direction of motion)
      // Left = up x tangent (+Y)
      // NormalUp = tangent x left (+Z pointing towards camera)
      const upVector = new THREE.Vector3(0, 0, 1);
      const leftVector = new THREE.Vector3().crossVectors(upVector, tangent).normalize();
      const normalUp = new THREE.Vector3().crossVectors(tangent, leftVector).normalize();

      const rotMatrix = new THREE.Matrix4();
      rotMatrix.makeBasis(tangent, leftVector, normalUp);
      arrowHead.arrowGroup.quaternion.setFromRotationMatrix(rotMatrix);

      // Organic bank/roll into upcoming corners
      const lookAheadProgress = (currentProgress + 0.012) % 1;
      const futureTangent = curve.getTangentAt(lookAheadProgress).normalize();
      const turnDot = futureTangent.dot(leftVector);
      const rollAngle = THREE.MathUtils.clamp(turnDot * 0.4, -0.25, 0.25);
      arrowHead.arrowGroup.rotateX(rollAngle);

      // Position arrow head slightly above the asphalt surface
      arrowHead.arrowGroup.position.set(position.x, position.y, position.z + 0.05);

      checkpointMeshes.forEach(({ ring, dot, badge }, index) => {
        const isReached = currentProgress >= CHECKPOINT_PROGRESS[index] - 0.02;
        const isActive = Math.abs(currentProgress - CHECKPOINT_PROGRESS[index]) < 0.045;
        const color = isActive ? 0xffffff : isReached ? 0xcccccc : 0x555555;
        (ring.material as THREE.MeshBasicMaterial).color.setHex(color);
        (dot.material as THREE.MeshBasicMaterial).color.setHex(
          isActive ? 0xffffff : isReached ? 0xdddddd : 0x777777
        );
        badge.material.opacity = isActive ? 1 : isReached ? 0.75 : 0.35;
      });

      render();
    };

    trackApiRef.current = {
      setProgress,
      resize,
      dispose: () => {
        resizeObserver.disconnect();
        road.geometry.dispose();
        (road.material as THREE.Material).dispose();
        circuitOutline.geometry.dispose();
        (circuitOutline.material as THREE.Material).dispose();
        route.geometry.dispose();
        (route.material as THREE.Material).dispose();
        arrowHead.dispose();
        checkpointMeshes.forEach(({ ring, dot, badge }) => {
          ring.geometry.dispose();
          (ring.material as THREE.Material).dispose();
          dot.geometry.dispose();
          (dot.material as THREE.Material).dispose();
          badge.material.map?.dispose();
          badge.material.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
        trackApiRef.current = null;
      },
    };

    resize();
    setProgress(currentProgress);

    return () => trackApiRef.current?.dispose();
  }, []);

  const activeItem = TIMELINE_DATA[activeIndex] || TIMELINE_DATA[0];
  const activeCoord = checkpointCoords[activeIndex];

  // Dynamic positioning for the thin strip popup above/near the checkpoint
  const containerW = containerDimensions.width || 800;
  const containerH = containerDimensions.height || 500;
  
  // Compact thin strip width (stays well within bounds)
  const stripWidth = Math.min(340, Math.max(260, containerW - 40));
  const halfStripWidth = stripWidth / 2;

  // Clamped X coordinate to never clip screen edges
  const rawX = activeCoord ? activeCoord.x : containerW / 2;
  const clampedX = Math.max(halfStripWidth + 12, Math.min(rawX, containerW - halfStripWidth - 12));
  const rawY = activeCoord ? activeCoord.y : containerH / 2;

  // Since it's a thin strip (~46px height), only place below if checkpoint is within 70px of top
  const placeBelow = rawY < 72;
  const clampedY = placeBelow ? rawY + 20 : rawY - 20;

  return (
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[390svh] bg-black md:h-[450svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden bg-black px-4 pt-14 pb-5 sm:px-8 sm:pt-16 sm:pb-6 lg:px-14">
        {/* Header Bar */}
        <header className="mx-auto w-full max-w-[1300px] flex flex-col items-start gap-3 border-b border-white/10 pb-3 md:flex-row md:items-end md:justify-between md:gap-4">
          <div>
            <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-400 sm:text-[10px]">
              04 / The aDOPE archive · MGIT, Hyderabad
            </span>
            <h2 className="history-heading section-heading max-w-full font-extrabold uppercase tracking-[-0.05em] text-white">
              History in motion
            </h2>
          </div>
          <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
            {/* F1 Sound Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSoundOn
                  ? 'border-white/50 bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  : 'border-white/20 bg-black/60 text-neutral-400 hover:border-white/40 hover:text-white'
              }`}
              title={isSoundOn ? 'Mute F1 sound effects' : 'Enable F1 racing sound effects'}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isSoundOn ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
              <span>{isSoundOn ? 'SFX ON' : 'SFX OFF'}</span>
            </button>
            <div className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              <span className="hidden sm:inline">Silverstone Circuit · </span>
              <span className="text-white font-semibold">Checkpoint {String(activeIndex + 1).padStart(2, '0')} / 11</span>
            </div>
          </div>
        </header>

        {/* Center Stage: Pure Black Seamless Circuit with Floating Thin Strip Pop-up */}
        <div className="relative mx-auto my-auto w-full max-w-[1300px] flex-1 flex items-center justify-center min-h-0 py-1 sm:py-3">
          {/* Canvas Container with NO GREY BORDER */}
          <div className="relative w-full h-[64svh] sm:h-[70svh] max-h-[720px] min-h-[380px] bg-black overflow-hidden flex items-center justify-center">
            {/* Subtle center ambient radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

            {/* 3D Track WebGL Canvas */}
            <div
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="3D Silverstone circuit tracking 11 milestones across 2020 to 2026."
            />

            {/* Glowing Reticle Target beacon positioned directly at active checkpoint */}
            {activeCoord && (
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                style={{ left: activeCoord.x, top: activeCoord.y }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-7 w-7 rounded-full border border-white/70 bg-white/20 animate-ping" />
                  <span className="relative h-2.5 w-2.5 rounded-full border-2 border-white bg-white shadow-[0_0_12px_#ffffff]" />
                </div>
              </div>
            )}

            {/* Exact SVG Pointer Line connecting Checkpoint beacon directly to the Pop-up Strip */}
            {activeCoord && (
              <svg className="pointer-events-none absolute inset-0 h-full w-full z-25 overflow-visible">
                <defs>
                  <filter id="stemGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Illuminated connector line */}
                <line
                  x1={activeCoord.x}
                  y1={placeBelow ? activeCoord.y + 6 : activeCoord.y - 6}
                  x2={activeCoord.x}
                  y2={clampedY}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#stemGlow)"
                  strokeLinecap="round"
                />
                {/* Luminous anchor dot at contact point with the pill */}
                <circle
                  cx={activeCoord.x}
                  cy={clampedY}
                  r="2.5"
                  fill="#ffffff"
                  filter="url(#stemGlow)"
                />
              </svg>
            )}

            {/* Thin Strip Pop-up LITERALLY ABOVE the Checkpoint */}
            {activeCoord && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.92, y: placeBelow ? -10 : 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: placeBelow ? 6 : -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute z-30 pointer-events-auto"
                  style={{
                    left: `${clampedX}px`,
                    top: `${clampedY}px`,
                    transform: placeBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                    width: `${stripWidth}px`,
                  }}
                >
                  {/* Sleek Clickable Thin Strip */}
                  <button
                    type="button"
                    onClick={() => setSelectedMilestone(activeItem)}
                    className="group w-full flex items-center justify-between gap-2.5 rounded-full border border-white/30 bg-black/90 hover:bg-neutral-900 hover:border-white/70 pl-2 pr-2.5 py-1.5 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.06)] transition-all duration-200 cursor-pointer text-left hover:scale-[1.02] active:scale-[0.98]"
                    title="Click to view full milestone details"
                  >
                    {/* Milestone Photo Thumbnail */}
                    <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full border border-white/25 bg-neutral-900">
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.title}
                        className="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
                      />
                    </div>

                    {/* Milestone Title & Date */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400">
                        <span className="font-bold text-white/90">{activeItem.date}</span>
                        <span>·</span>
                        <span>#{String(activeIndex + 1).padStart(2, '0')}</span>
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-tight text-white truncate group-hover:text-neutral-100">
                        {activeItem.title}
                      </h4>
                    </div>

                    {/* Expand CTA Pill */}
                    <span className="shrink-0 flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-white transition-colors duration-200 group-hover:bg-white group-hover:text-black">
                      <span>Details</span>
                      <span className="text-[10px] font-bold">↗</span>
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Instruction tooltip in corner */}
            <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40 bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
              Scroll to drive · Click popup to inspect
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <footer className="mx-auto w-full max-w-[1300px] flex items-center justify-between pt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[9px]">
          <span>Archive Circuit / MGIT</span>
          <div className="flex items-center gap-1.5">
            {CHECKPOINT_PROGRESS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? 'w-6 bg-white shadow-[0_0_8px_#ffffff]'
                    : idx < activeIndex
                    ? 'w-2 bg-white/40'
                    : 'w-2 bg-white/15'
                }`}
              />
            ))}
          </div>
          <span>2020 – 2026</span>
        </footer>
      </div>

      {/* Expanded Milestone Details Modal (Triggered by clicking the popup) */}
      {selectedMilestone && createPortal(<AnimatePresence>
        {selectedMilestone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain border border-white/25 bg-neutral-950 p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.06)] rounded-lg text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer font-mono text-xs"
                title="Close"
              >
                ✕
              </button>

              {/* Photo Preview */}
              <div className="relative mb-4 w-full h-48 sm:h-56 rounded border border-white/15 bg-neutral-900 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedMilestone.imageUrl}
                  alt={selectedMilestone.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Version & Date Pill */}
              <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[9px] uppercase tracking-[0.16em]">
                <span className="text-neutral-400 font-medium">{selectedMilestone.version}</span>
                <span className="rounded border border-white/30 bg-white/15 px-2 py-0.5 font-bold tracking-widest text-white">
                  {selectedMilestone.date}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mb-2 text-lg sm:text-2xl font-extrabold uppercase leading-tight tracking-[-0.04em] text-white">
                {selectedMilestone.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-300">
                {selectedMilestone.description}
              </p>

              {/* Bullet Takeaways */}
              {selectedMilestone.fullDetails && selectedMilestone.fullDetails.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                    Key Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                    {selectedMilestone.fullDetails.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer Indicator */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-500">
                <span>Phase: {selectedMilestone.category}</span>
                <span className="text-white">Press ESC or click outside to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>, document.body)}
    </section>
  );
};

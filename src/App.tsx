import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ArtistsSection } from './components/ArtistsSection';
import { MeetTeamSection } from './components/MeetTeamSection';
import { CoreTeamSection } from './components/CoreTeamSection';
import { TimelineSection } from './components/TimelineSection';
import { VisualOutputSection } from './components/VisualOutputSection';
import { EventsSection } from './components/EventsSection';
import { ArtworkModal } from './components/ArtworkModal';
import { JoinModal } from './components/JoinModal';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { Artwork } from './types';

gsap.registerPlugin(ScrollTrigger);

const JOIN_FORM_URL = 'https://forms.gle/HYMR5CyABFc13pSK8';

export default function App() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [highlightedImageId, setHighlightedImageId] = useState<string | null>(null);

  const handleImageEnter = (imageId: string) => setHighlightedImageId(imageId);
  const handleImageLeave = (imageId: string) => {
    setHighlightedImageId((activeId) => activeId === imageId ? null : activeId);
  };

  const handleJoin = () => {
    window.open(JOIN_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  // Initialize Lenis Smooth Scrolling and link with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker for zero jitter
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Smoothly scroll on anchor clicks via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, { offset: -70 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  // Orchestrate GSAP ScrollTrigger section-to-section motion
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // 1. Global top reading indicator that scrubs with scroll
    const progressTrigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const bar = document.getElementById('global-scroll-progress');
        if (bar) {
          bar.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    triggers.push(progressTrigger);

    // 2. Section transitions & active section tracking
    const sectionIds = ['hero', 'about', 'artists', 'team', 'timeline', 'work', 'signal'];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id) || document.querySelector(`section#${id}`);
      if (!el) return;

      // Active section in navbar tracking with exact ScrollTrigger thresholds
      const activeTrigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 48%',
        end: 'bottom 48%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
      triggers.push(activeTrigger);

      // Section-to-section entrance motion
      if (id !== 'hero') {
        const tween = gsap.fromTo(
          el,
          {
            opacity: 0.88,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }
    });

    // 3. Section Headers & Titles GSAP Stagger Entrance
    const headers = document.querySelectorAll('main h2');
    headers.forEach((h2) => {
      const headerTween = gsap.fromTo(
        h2,
        {
          opacity: 0,
          y: 45,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h2,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (headerTween.scrollTrigger) triggers.push(headerTween.scrollTrigger);
    });

    // 4. Section Divider Lines Scale-in
    const dividers = document.querySelectorAll('main .border-b, main .h-px');
    dividers.forEach((div) => {
      const divTween = gsap.fromTo(
        div,
        {
          scaleX: 0,
          transformOrigin: 'left center',
        },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: div,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (divTween.scrollTrigger) triggers.push(divTween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen flex flex-col font-sans selection:bg-white selection:text-black relative">
      <CustomCursor />

      {/* Top Global Scroll Progress Bar */}
      <div
        id="global-scroll-progress"
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white via-neutral-300 to-white z-[60] pointer-events-none origin-left transition-transform duration-75"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Navigation */}
      <Navbar
        onOpenJoinModal={handleJoin}
        activeSection={activeSection}
      />

      {/* Hero Section */}
      <div id="hero">
        <Hero />
      </div>

      {/* Main Content Sections */}
      <main className="flex-grow">
        <EventsSection />
        <AboutSection />
        <ArtistsSection highlightedImageId={highlightedImageId} onImageEnter={handleImageEnter} onImageLeave={handleImageLeave} />
        <MeetTeamSection highlightedImageId={highlightedImageId} onImageEnter={handleImageEnter} onImageLeave={handleImageLeave} />
        <CoreTeamSection highlightedImageId={highlightedImageId} onImageEnter={handleImageEnter} onImageLeave={handleImageLeave} />
        <TimelineSection />
        <VisualOutputSection
          highlightedImageId={highlightedImageId}
          onImageEnter={handleImageEnter}
          onImageLeave={handleImageLeave}
          onSelectArtwork={(artwork) => setSelectedArtwork(artwork)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Inspector & Join Modals */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}

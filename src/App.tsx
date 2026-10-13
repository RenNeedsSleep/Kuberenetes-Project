import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ArtistsSection } from './components/ArtistsSection';
import { CoreTeamSection } from './components/CoreTeamSection';
import { TimelineSection } from './components/TimelineSection';
import { VisualOutputSection } from './components/VisualOutputSection';
import { ArtworkModal } from './components/ArtworkModal';
import { JoinModal } from './components/JoinModal';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { Artwork } from './types';

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

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'artists', 'team', 'timeline', 'work'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans selection:bg-white selection:text-black relative">
      <CustomCursor />
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
        <AboutSection highlightedImageId={highlightedImageId} onImageEnter={handleImageEnter} onImageLeave={handleImageLeave} />
        <ArtistsSection highlightedImageId={highlightedImageId} onImageEnter={handleImageEnter} onImageLeave={handleImageLeave} />
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

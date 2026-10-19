import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { LOGO_URL } from '../data/mockData';

const getEventsUnseen = () => {
  try {
    const seen = JSON.parse(localStorage.getItem('adope-seen-announcements') || '[]') as string[];
    return !['disegno-open-call-2026'].every((id) => seen.includes(id));
  } catch { return true; }
};

interface NavbarProps {
  onOpenJoinModal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoinModal, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [eventsUnseen, setEventsUnseen] = useState(getEventsUnseen);

  useEffect(() => {
    const markSeen = () => setEventsUnseen(getEventsUnseen());
    window.addEventListener('adope:events-seen', markSeen);
    return () => window.removeEventListener('adope:events-seen', markSeen);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      if (currentScrollY <= 30) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY + 5) {
        // Scrolling down
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Re-appear when cursor is near top of screen (within 70px)
      if (e.clientY <= 70) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navLinks = [
    { name: 'Voyage', href: '#about' },
    { name: 'Events', href: '#events', isEvent: true },
    { name: 'Artists', href: '#artists' },
    { name: 'Core Team', href: '#team' },
    { name: 'Archive', href: '#timeline' },
    { name: 'Visual Output', href: '#work' },
  ];

  return (
    <>
      {/* Invisible top hover trigger area */}
      <div
        className="fixed top-0 left-0 w-full h-5 z-[55] pointer-events-auto"
        onMouseEnter={() => setVisible(true)}
      />

      <header
        onMouseEnter={() => setVisible(true)}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 transform ${
          visible ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        } ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-4'
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={LOGO_URL}
              alt="Adope Club Logo"
              className="h-8 md:h-9 object-contain filter invert brightness-125 opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-widest transition-all duration-300 relative py-1 ${link.isEvent && eventsUnseen ? 'event-nav-unseen' : ''} ${
                    isActive
                      ? 'text-white font-semibold border-b border-white'
                      : 'text-white/60 hover:text-white hover:border-b hover:border-white/40'
                  }`}
                >
                  {link.name}
                  {link.isEvent && eventsUnseen && <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-red-500" />}
                </a>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://forms.gle/HYMR5CyABFc13pSK8"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn bg-white text-black font-mono text-xs px-5 py-2.5 uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-all duration-300 flex items-center gap-2"
            >
              Join Club
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative md:hidden min-h-11 min-w-11 flex items-center justify-center text-white p-2 hover:bg-white/5 border border-white/10 transition-colors"
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            {eventsUnseen && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.8)]" />}
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 animate-fade-in-up z-50 pointer-events-auto">
            <div className="flex flex-col gap-2 sm:gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-mono text-sm uppercase tracking-widest text-white/80 hover:text-white py-2 border-b border-white/5 flex justify-between items-center ${link.isEvent && eventsUnseen ? 'event-nav-unseen' : ''}`}
                >
                  {link.name}
                  {link.isEvent && eventsUnseen ? <span className="h-2 w-2 rounded-full bg-red-500" /> : <span className="text-xs text-white/30">➔</span>}
                </a>
              ))}
            </div>

            <a
              href="https://forms.gle/HYMR5CyABFc13pSK8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-white text-black font-mono text-xs py-3.5 uppercase tracking-widest font-semibold text-center mt-2 flex justify-center items-center gap-2"
            >
              Join Adope Club
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </header>
    </>
  );
};

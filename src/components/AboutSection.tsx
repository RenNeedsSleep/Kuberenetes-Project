import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-[#131313] border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4">
              01 // Mission &amp; Ethos
            </span>
              <h2 className="max-w-[11ch] text-[clamp(1.5rem,3.1vw,2.75rem)] font-bold uppercase tracking-[-0.055em] text-white leading-[1.02]">
              Artists,<br />
              Designers &amp;<br />
              Originals
            </h2>
          </div>

          <div className="lg:col-span-7">
              <div className="max-w-2xl py-2 lg:py-8">
              <p className="text-lg sm:text-xl text-neutral-300 mb-6 leading-relaxed">
                aDOPE is the design club of Mahatma Gandhi Institute of Technology in Hyderabad. It brings student creatives together to make identities, posters, editorial work, digital art, interfaces, and merchandise for campus culture.
              </p>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                The club describes itself as a design team and digital art club. Its public archive shows a practice grounded in visual communication, collaborative briefs, and making memorable work for MGIT.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

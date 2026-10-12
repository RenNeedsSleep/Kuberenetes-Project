import React, { useState } from 'react';
import { CORE_TEAM_DATA } from '../data/mockData';
import { CoreTeamMember } from '../types';

export const CoreTeamSection: React.FC = () => {
  const [touchedMemberImage, setTouchedMemberImage] = useState<string | null>(null);

  return (
    <section id="team" className="py-16 sm:py-24 lg:py-32 bg-[#131313] border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-5 sm:gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
              03 // Core Team
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              The People Behind aDOPE
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 leading-relaxed">
            The club's leadership keeps the work moving across identity, events, and digital art at MGIT.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CORE_TEAM_DATA.map((member: CoreTeamMember) => (
            <article
              key={member.id}
              className="bg-[#1A1A1A] border border-white/10 p-4 sm:p-5 relative group hover:border-white/40 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 group-hover:border-white" />
              <div
                className="aspect-[4/5] bg-[#0E0E0E] border border-white/10 mb-5 overflow-hidden flex items-center justify-center"
                onClick={() => setTouchedMemberImage(member.id)}
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className={`w-full h-full object-cover ${member.id === 'core-member-01' ? 'object-[30%_center]' : ''} grayscale transition-all duration-500 group-hover:grayscale-0`}
                    style={touchedMemberImage === member.id ? { filter: 'none' } : undefined}
                  />
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    Profile pending
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                {member.role}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2 mb-3 tracking-tight">
                {member.name}
              </h3>
              {member.bio && (
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {member.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

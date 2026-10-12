import { Artwork, Artist, CoreTeamMember, TimelineLog } from '../types';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW0pNxZMQe6i_wc32ptVOFF_BMqDiFRRn_CWrZhn_EdFSOVEGUgT46I-Vh-ECufF1dgq5qiXvdA4tOk9DPKqt7U8K5zIaQBxbzSgjnfui56ejkeYuVs2exEDi2VbuoKBWG1xNvMw4mrAp1PYBWXYAE9ban460reW7l-CfNoru4vwYW7iSnSy_-Xtli1BPIhDqOjlf-DNxm3W3-GoSXud7CIBZOWQVmm0ITueIM4nItWgMvrD4M3Md7Rm9cSCuEaV8y3Dc';

export const HERO_BADGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUI6Ip2t6vPcyrIFnj6LkzVApZ2B0Ssuz5T2TP1zGhyNddjguehm_psjqS07L-xdCQjgsPZUEn7HFuU7DTxVz0WdsLmbsMO42Ud9FAdbvxMY-HG4cPgh61Q1NaNFBYNATSZjYfTQq1VxGHT7dzQcM9uxd8e6ZEnmnETAi9sTdkfN1FlyEGH91Nbzla-xge_ZMoCN44NSy_ylpyM_uWIDTofgrr1o8R40tT8lOy2kCIbtSnf5mO1CIDFe1-x0S309HgPXI';

export const HERO_TEXTURE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqt1tOPQoNjIbDr58Wa5R6wK3fL-BN9KIpawbKFeyKJAT9tdS1frV0UX3N0GJZBeBR65iMBP0NM66xwaQEi2gg6JHo2yBoo7z8KN-iY4UChWQWVN27QDcygJL9n8mXUpYwWduQyVDQrDhTsuxcV4UDLIhsURFVpVs_xISpP55qa36uLb_q0pp_YCnYbYGOyxSLlIZA5LdAL-fHBlosBy7dGqPCTe_3wRf5jBrR5l3dpIdv26Vl-4Uvdw';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/adopeclub_mgit/',
  linkedin: 'https://www.linkedin.com/company/adope-mgit/',
  behance: 'https://www.behance.net/adopeclubmgit',
  youtube: 'https://www.youtube.com/@adopeclubmgit3',
};

export const ARTWORKS_DATA: Artwork[] = [
  {
    id: 'art-nirvana-2026',
    title: 'NIRVANA 2026',
    category: 'Event Identity',
    imageUrl: '/nirvana-phoenix.png',
    description: 'A dimensional phoenix emblem created for NIRVANA 2026, MGIT’s annual fest.',
    year: '2026',
    artistName: 'NIRVANA',
    specs: ['Event Identity', 'Phoenix Emblem', '3D Artwork'],
    tags: ['NIRVANA', '2026', 'MGIT'],
    featured: true
  },
  {
    id: 'art-2',
    title: 'Magazine Design',
    category: 'Editorial',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/bbaf7c167501801.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    description: 'Editorial design project published in the aDOPE Club Behance portfolio.',
    year: '2023',
    artistName: 'aDOPE Club',
    specs: ['Editorial Design', 'Layout', 'Art Direction'],
    tags: ['Editorial', 'Magazine', 'Typography'],
    featured: true
  },
  {
    id: 'art-3',
    title: 'UI/UX Design',
    category: 'UI/UX',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/c5a61d167501611.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    description: 'Interface design work from the club’s public portfolio of creative projects.',
    year: '2023',
    artistName: 'aDOPE Club',
    specs: ['UI/UX', 'Interface Systems', 'Visual Design'],
    tags: ['UI/UX', 'Digital Art', 'Design'],
    featured: true
  },
  {
    id: 'art-4',
    title: 'Event Posters',
    category: 'Posters',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/9d18f5167500789.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    description: 'Poster work representing aDOPE’s role as an event-focused design team at MGIT.',
    year: '2023',
    artistName: 'aDOPE Club',
    specs: ['Poster Design', 'Campaign Graphics', 'Art Direction'],
    tags: ['Posters', 'Events', 'Graphic Design'],
    featured: true
  },
  {
    id: 'art-5',
    title: 'Logo Design',
    category: 'Logo Design',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/ee1ac3167501207.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    description: 'Logo design work from aDOPE Club’s identity and branding archive.',
    year: '2023',
    artistName: 'aDOPE Club',
    specs: ['Logo Design', 'Identity', 'Brand Systems'],
    tags: ['Logo', 'Branding', 'Identity'],
    featured: false
  },
  {
    id: 'art-6',
    title: 'Posters',
    category: 'Posters',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/77f98b167500645.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    description: 'A poster collection documenting aDOPE’s graphic design practice.',
    year: '2023',
    artistName: 'aDOPE Club',
    specs: ['Graphic Design', 'Composition', 'Print'],
    tags: ['Posters', 'Print', 'Visual Communication'],
    featured: false
  }
];

export const TIMELINE_DATA: TimelineLog[] = [
  {
    id: 'log-1',
    version: 'ORIGIN / MGIT',
    title: 'A design team takes shape',
    category: 'Club History',
    description: 'aDOPE is part of Mahatma Gandhi Institute of Technology in Hyderabad, where it operates as a student design club.',
    fullDetails: [
      'MGIT lists Adope Design Club among its student clubs and organizations.',
      'The club is based at Mahatma Gandhi Institute of Technology in Hyderabad, India.',
      'Public profiles describe aDOPE as a design and digital art club.'
    ],
    date: 'MGIT',
    imageUrl: LOGO_URL
  },
  {
    id: 'log-2',
    version: 'TEAM / 12',
    title: 'Branding events across campus',
    category: 'Collaboration',
    description: 'The club’s LinkedIn profile describes its beginning as a team of 12 focused on branding every event it sponsored.',
    fullDetails: [
      'Event branding is a central part of aDOPE’s public identity.',
      'The club brings together student designers around shared briefs and visual systems.',
      'Its work extends beyond a single medium: posters, identity, editorial, merchandise, and interfaces.'
    ],
    date: 'FOUNDING STORY',
    imageUrl: '/nirvana-phoenix.png'
  },
  {
    id: 'log-3',
    version: 'PUBLIC / ARCHIVE',
    title: 'From identity to digital art',
    category: 'Portfolio',
    description: 'The public portfolio documents a range of work including logos, posters, magazine design, UI/UX, and merchandise.',
    fullDetails: [
      'Behance portfolio: Club LOGO, LOGO Design, Posters, Event posters, UI/UX Design, Magazine Design, and Merchandise.',
      'The archive reflects a practice rooted in visual communication and design craft.',
      'Public work is collected at behance.net/adopeclubmgit.'
    ],
    date: 'PORTFOLIO',
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/bbaf7c167501801.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png'
  }
];

export const ARTISTS_DATA: Artist[] = [
  {
    id: 'practice-branding',
    name: 'Brand & Identity',
    role: 'Practice Area',
    avatarUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/ee1ac3167501207.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    bio: 'Logos, visual identities, and brand systems for clubs, events, and campus culture.',
    specialty: ['Branding', 'Logo Design', 'Art Direction']
  },
  {
    id: 'practice-editorial',
    name: 'Editorial & Print',
    role: 'Practice Area',
    avatarUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/bbaf7c167501801.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    bio: 'Magazine layouts, posters, and print-led compositions built for clear visual communication.',
    specialty: ['Editorial', 'Posters', 'Typography']
  },
  {
    id: 'practice-digital',
    name: 'Digital Art & UI/UX',
    role: 'Practice Area',
    avatarUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/c5a61d167501611.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    bio: 'Digital interfaces and visual experiments that extend the club’s graphic design practice onto screens.',
    specialty: ['UI/UX', 'Digital Art', 'Visual Design']
  },
  {
    id: 'practice-campaigns',
    name: 'Events & Campaigns',
    role: 'Practice Area',
    avatarUrl: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/9d18f5167500789.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    bio: 'Campaign graphics and event visuals that connect the club’s design work to MGIT’s campus life.',
    specialty: ['Events', 'Campaigns', 'Graphic Design']
  }
];

export const CORE_TEAM_DATA: CoreTeamMember[] = [
  {
    id: 'core-head',
    name: 'Krish SRK',
    role: 'Head',
    imageUrl: '/krish-srk.jpeg',
    bio: 'Leading aDOPE\'s visual direction and creative work.'
  },
  {
    id: 'core-co-head',
    name: 'Sohail Ali',
    role: 'Co-Head',
    imageUrl: '/sohail.jpeg',
    bio: 'Supporting aDOPE\'s creative direction and coordinating the club\'s design initiatives.'
  },
  {
    id: 'core-secretary',
    name: 'T Siddhartha Karthik',
    role: 'Secretary',
    imageUrl: '/secretary-siddhartha.jpeg',
    bio: 'Keeping aDOPE’s plans, records, and team communication organized so creative projects move forward smoothly.'
  },
  {
    id: 'core-president',
    name: 'Akshit Bulusu',
    role: 'President',
    imageUrl: '/akshit-bulusu.jpeg',
    bio: 'Leading aDOPE’s creative community and guiding the club’s vision and initiatives.'
  },
  {
    id: 'core-member-01',
    name: 'Abhisheik Krishna Mopada',
    role: 'President',
    imageUrl: '/abhisheik-krishna-mopada.jpeg',
    bio: 'Representing aDOPE and guiding its creative community, vision, and initiatives.'
  },
  {
    id: 'core-member-02',
    name: 'Shyam Sunder Pabboju',
    role: 'Faculty Coordinator',
    imageUrl: '/shyam-sunder-pabboju.png',
    bio: 'Guiding aDOPE’s student team with faculty insight and support for its creative initiatives.'
  },
  {
    id: 'core-member-03',
    name: 'Sree Divya',
    role: 'Faculty Coordinator',
    imageUrl: '/sree-divya.png',
    bio: 'Supporting aDOPE’s student team through faculty mentorship across its creative work.'
  }
];

export const CLUB_STATS = [
  { label: 'Home Base', value: 'MGIT' },
  { label: 'Founded As', value: '12' },
  { label: 'Portfolio Projects', value: '7' },
  { label: 'Core Practice', value: 'DESIGN' }
];

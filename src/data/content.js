// ─────────────────────────────────────────────────────────
// EDIT THIS FILE to personalize your portfolio.
// Every section on the site reads from here.
// ─────────────────────────────────────────────────────────

export const profile = {
  name: 'Rohit Kumar',
  role: 'Full-Stack Developer',
  tagline:
    'I design and build web systems end to end — from database schema to the pixel you click on.',
  location: 'Patna, Bihar',
  email: 'rohitrajyadav6522@gmail.com',
  resumeUrl: '/resume.pdf',
  calendlyUrl: 'https://calendly.com/rohitrajyadav6522/30min',
  social: [
    { label: 'GitHub', url: 'https://github.com/rohit6522' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rohit-kumar-382948324/' },
    { label: 'Twitter', url: 'https://x.com/mrrohit24916746?s=21' },
  ],
}

// Shown as nodes radiating from your name in the hero diagram.
// Keep this to 5–7 items — it's drawn as a graph, not a list.
export const stackNodes = [
  'React',
  'Node.js',
  'MySQL',
  'JavaScript',
  'AWS',
  'Docker',
]



export const education = [
  {
    school: 'Lovely Professional University (current)',
    degree: 'B.Tech in Computer Science & Engineering',
    period: '2024 — 2028',
    description: 'Currently pursuing an undergraduate program in computer science with a focus on software development and system design.',
  },
  {
    school: 'B.S.S. College',
    degree: 'Higher Secondary Education, Science (PCM)',
    period: 'May 2021 - Jun 2023',
    description: 'Completed higher secondary education with a focus on Physics, Chemistry, and Mathematics.',
  },
  {
    school: 'MDJ Public School',
    degree: 'Secondary Education',
    period: 'March 2020 - April 2021',
    description: 'Completed secondary education with involvement in various activities.',
  },
]

export const certifications = [
  {
    title: 'Programming Using C++',
    issuer: 'Infosys Springboard',
    date: 'August 21, 2025',
    credentialUrl: 'https://drive.google.com/file/d/1Qu4qHYBhsR8zhKKNakDuXCGn-HNBheda/view?usp=sharing',
  },
  {
    title: 'Computer Programming (72 Hours)',
    issuer: 'Lovely Professional University · iamNeo',
    date: 'January 2025 – May 2025',
    credentialUrl: 'https://drive.google.com/file/d/1cxk0HM3XWyGbrQjHYoropofUPkIf0z7M/view?usp=sharing',
  },
  {
    title: 'Programming in JAVA',
    issuer: 'iamNeo — An NIIT Venture',
    date: 'January 2026 – May 2026',
    credentialUrl: 'https://drive.google.com/file/d/1e6mzjtAvUEqtJ32AK41CSEFPPy_Lo3mq/view?usp=sharing',
  },
  // new add comming soon
  {
    title: 'Database Management System Part - 1',
    issuer: 'Infosys Springboard',
    date: 'July 16, 2026',
    credentialUrl: 'https://drive.google.com/file/d/1Hc7_7Q4vncXdIfTGl-JWTufARELLEKw_/view?usp=sharing',
  },
  {
    title: 'Programming in JAVA',
    issuer: 'iamNeo — An NIIT Venture',
    date: 'January 2026 – May 2026',
    credentialUrl: 'https://drive.google.com/file/d/1e6mzjtAvUEqtJ32AK41CSEFPPy_Lo3mq/view?usp=sharing',
  },
  {
    title: 'Programming in JAVA',
    issuer: 'iamNeo — An NIIT Venture',
    date: 'January 2026 – May 2026',
    credentialUrl: 'https://drive.google.com/file/d/1e6mzjtAvUEqtJ32AK41CSEFPPy_Lo3mq/view?usp=sharing',
  },
]


export const skills = [
 {
  category: 'Languages',
  items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'SQL'],
},
{
  category: 'Frontend',
  items: ['HTML', 'CSS', 'React', 'Tailwind CSS', 'Vite'],
},
{
  category: 'Backend',
  items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication'],
},
{
  category: 'Database',
  items: ['MySQL', 'MongoDB', 'DBMS'],
},
{
  category: 'Core CS',
  items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Computer Networks'],
},
{
  category: 'Tools',
  items: ['Git', 'GitHub', 'VS Code', 'Postman'],
},
]



export const projects = [
  {
   title: 'Fitness Training Portal',
    category: 'WEB APP',
    featured: true,
    status: 'STABLE',
   summary:
      'A modern full-stack fitness platform that helps users plan workouts, monitor progress, follow personalized training schedules, and securely manage their accounts with authentication and real-time data.',

    features: [
      'Personalized workout plan builder',
      'Real-time progress & goal tracking',
      'Secure auth with JWT & Firebase',
      'Daily streak, calorie & water tracking',
    ],
    images: ['/projects/fitness.jpg','/projects/Fitness1.jpg','/projects/Fitness2.jpg'],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB','Tailwind CSS','JWT','Firebase'],


   liveUrl: 'https://fitnessapp-frontend-xiht.onrender.com',
    codeUrl: 'https://github.com/rohit6522/FitnessApp',
  },

  {
  title: 'Smart Hospital Emergency System',
  category: 'WEB APP',
  featured: true,
  status: 'IN PROGRESS',
  summary:
    'An AI-powered emergency response and routing system that helps hospitals triage and route incoming emergencies faster.',
  features: [
    'AI-assisted emergency routing logic',
    'Real-time hospital availability tracking',
    'React frontend with Java backend services',
  ],
  images: ['/projects/hospital.jpg','/projects/hospital1.jpg','/projects/hospital2.jpg','/projects/hospital3.jpg'],
  tags: ['React', 'Java', 'Spring Boot', 'CSS'],
  liveUrl: 'https://smart-hospital-frontend-wcd3.onrender.com/',
  codeUrl: 'https://github.com/rohit6522/smart-hospital-emergency-system',
},
  {
    title: 'Signalboard',
    category: 'WEB APP',
    featured: false,
    status: 'STABLE',
    summary:
      'A monitoring dashboard that turns raw infrastructure metrics into plain-language alerts for on-call engineers.',
    features: [
      'Plain-language alert generation',
      'Custom on-call escalation rules',
    ],
    images: ['/projects/signalboard-1.jpg'],
    tags: ['TypeScript', 'D3.js', 'Docker'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'Fieldnote',
    category: 'MOBILE APP',
    featured: false,
    status: 'IN PROGRESS',
    summary:
      'An offline-first note-taking tool for researchers doing fieldwork with unreliable connectivity.',
    features: [
      'Offline-first with background sync',
      'Conflict-free merge engine',
    ],
    images: ['/projects/fieldnote-1.jpg'],
    tags: ['React Native', 'SQLite', 'Sync engine'],
    liveUrl: '#',
    codeUrl: '#',
  },
]

export const achievements = [
  { icon: '</>', label: 'Coding Platforms', stat: '300+ Solved', highlight: false },
  { icon: '★', label: 'C++ · HackerRank', stat: '5-Star Status', highlight: false },
  { icon: '🏅', label: 'National Ranking', stat: '13th Rank, India', highlight: true },
]

export const archiveCategories = ['Web Apps', 'Mobile Apps', 'Extensions', 'Trained Models']

export const archiveProjects = [
  {
    title: 'MicroStack',
    summary: 'A fully deployed microservices architecture with auth, file upload, and notifications.',
    category: 'Web Apps',
    tags: ['Node.js', 'Docker', 'RabbitMQ'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'VCS-X',
    summary: 'An API-first version control system — Git for the API era.',
    category: 'Web Apps',
    tags: ['Go', 'REST API'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'AlgoFlow Studio',
    summary: 'A visual playground for building and testing sorting and pathfinding algorithms.',
    category: 'Web Apps',
    tags: ['React', 'Canvas API'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'Wanderlog',
    summary: 'A trip-planning app that syncs itineraries across devices, even offline.',
    category: 'Mobile Apps',
    tags: ['React Native', 'SQLite'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'Focusly',
    summary: 'A minimalist Pomodoro and habit tracker with home-screen widgets.',
    category: 'Mobile Apps',
    tags: ['Flutter', 'Firebase'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'TabSnap',
    summary: 'A browser extension that saves and organizes tab sessions into named workspaces.',
    category: 'Extensions',
    tags: ['JavaScript', 'Chrome API'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'ReadMode+',
    summary: 'A distraction-free reading extension with adjustable typography and dark mode.',
    category: 'Extensions',
    tags: ['TypeScript', 'Chrome API'],
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    title: 'ChurnGuard',
    summary: 'A trained model predicting customer churn risk from usage patterns.',
    category: 'Trained Models',
    tags: ['Python', 'scikit-learn'],
    liveUrl: '#',
    codeUrl: '#',
  },
]

export const experience = [
  {
    role: 'Senior Full-Stack Engineer',
    company: 'Northbeam Software',
    period: '2022 — Present',
    points: [
      'Lead a team of 4 engineers rebuilding the core billing platform, cutting invoice-processing time by 60%.',
      'Introduced a shared component library adopted across 3 product teams.',
    ],
  },
  {
    role: 'Full-Stack Engineer',
    company: 'Harborlight',
    period: '2020 — 2022',
    points: [
      'Built the customer-facing dashboard from scratch, growing to 15,000 weekly active users.',
      'Migrated a legacy monolith to a service-based architecture with zero downtime.',
    ],
  },
  {
    role: 'Junior Developer',
    company: 'Kettlecorn Studio',
    period: '2018 — 2020',
    points: [
      'Shipped client websites and internal tools for a 12-person digital agency.',
      'Owned QA and deployment process for all client projects.',
    ],
  },
]

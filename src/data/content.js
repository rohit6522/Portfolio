// ─────────────────────────────────────────────────────────
// EDIT THIS FILE to personalize your portfolio.
// Every section on the site reads from here.
// ─────────────────────────────────────────────────────────

export const profile = {
  name: 'Rohit Kumar',
  role: 'Full-Stack Developer',

 tagline:
    'I design and build web systems end to end — from database schema to the pixel you click on.',
  bio:
    "I love building things that actually work — clean code, functional apps, real solutions to real problems. I'm not here to write code that just runs; I build things that reduce friction, cut the noise, and make life easier for the people using them.",
  shortLine: "Clean code. Functional apps. Less pain points. That's the whole vibe.",

  location: 'Patna, Bihar',
  email: 'rohitrajyadav6522@gmail.com',

  resumeUrl: '/resumePortfolio.pdf',
  calendlyUrl: 'https://calendly.com/rohitrajyadav6522/30min',
  githubUsername: 'rohit6522',
  leetcodeUsername: 'rohit6522',
  social: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rohit-kumar-382948324/' },
    { label: 'GitHub', url: 'https://github.com/rohit6522' },
    { label: 'Twitter', url: 'https://x.com/home' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/rohit6522/' },
    { label: 'Discord', url: 'https://discord.com/channels/@me' },
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
  {
    title: 'Database Management System Part - 1',
    issuer: 'Infosys Springboard',
    date: 'July 16, 2026',
    credentialUrl: 'https://drive.google.com/file/d/1Hc7_7Q4vncXdIfTGl-JWTufARELLEKw_/view?usp=sharing',
  },

    // new add comming soon

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
    title: 'Smart Cart — Budget-Aware Shopping Platform',
    category: 'Full-Stack Web Application',
    period: 'Jul 2026 – Present',
    featured: true,
    status: 'LIVE',
   summary:
      'A full-stack eCommerce platform that solves checkout anxiety by tracking a shopper\'s budget in real time as they add items to their cart, with dedicated dashboards for shoppers, admins, and delivery partners.',

    features: [
     'Real-time budget tracker with live progress bar and over-budget alerts',
    'Role-based authentication (Shopper / Admin / Delivery Partner) using JWT',
    'Razorpay payment integration with Cash-on-Delivery fallback',
    'Full order lifecycle: cart → checkout → delivery assignment → tracking',
    'Admin panel for product & order management with delivery assignment',
    'Automated order confirmation emails and downloadable invoices',
    ],
     images: ['/projects/Ecom/smartCart.jpg','/projects/Ecom/smartCart1.jpg','/projects/Ecom/smartCart2.jpg','/projects/Ecom/smartCart3.jpg','/projects/Ecom/smartCart4.jpg'],

  tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Razorpay'],

   liveUrl: 'https://smartcart-frontend-g472.onrender.com/',
  codeUrl: 'https://github.com/rohit6522/smart-cart-ecommerce',
  },

  {
  title: 'Smart Hospital Emergency System',
  category: 'Web Application',
  period: 'Jul 2026 – Present',
  featured: true,
  status: 'IN PROGRESS',
  summary:
    'An AI-powered emergency response and routing system that helps hospitals triage and route incoming emergencies faster.',
  features: [
    'AI-assisted emergency routing logic',
    'Live ambulance tracking and dynamic hospital resource management',
    'React frontend with Java backend services',
  ],
  images: ['/projects/Hospital/hospital.jpg','/projects/Hospital/hospital1.jpg','/projects/Hospital/hospital2.jpg','/projects/Hospital/hospital3.jpg'],
  tags: ['React', 'Java', 'Spring Boot', 'Tailwind CSS','MySQL', 'WebSocket', 'JWT Auth'],
  liveUrl: 'https://smart-hospital-frontend-wcd3.onrender.com/',
  codeUrl: 'https://github.com/rohit6522/smart-hospital-emergency-system',
},

{
    title: 'Fitness Training Portal',
    category: 'Web Application',
    period: 'March – May 2026',
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
    images: ['/projects/Fittnesss/fitness.jpg','/projects/Fittnesss/Fitness1.jpg','/projects/Fittnesss/Fitness2.jpg'],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB','Tailwind CSS','JWT','Firebase'],

   liveUrl: 'https://fitnessapp-frontend-xiht.onrender.com',
    codeUrl: 'https://github.com/rohit6522/FitnessApp',
  },
  {
    title: 'Signalboard',
    category: 'Web Application',
    period: 'Mar – Jun 2024',
    featured: false,
    status: 'STABLE',
    
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
  { icon: '</>', label: 'Coding Platforms', stat: '150+ Solved', highlight: false },
  // { icon: '★', label: 'C++ · HackerRank', stat: '5-Star Status', highlight: false },
  // { icon: '🏅', label: 'National Ranking', stat: '13th Rank, India', highlight: true },
]

export const archiveCategories = ['Web Apps', 'Mobile Apps']

export const archiveProjects = [
  {
    title: 'ResumeAI — AI Resume Analyzer',
    summary: 'A full-stack SaaS platform that parses resumes (PDF/DOCX), generates AI-powered ATS scores, and matches resumes against job descriptions using Gemini AI. Built with JWT authentication, PDF report generation, and a fully responsive UI.',
     images: ['/projects/AiResume/Resume.jpg','/projects/AiResume/Resume1.jpg','/projects/AiResume/Resume2.jpg','/projects/AiResume/Resume3.jpg'],
    category: 'Web Apps',
    period: 'Jul 2026 – Present',
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Gemini AI'],
    liveUrl: 'https://resume-analyzer-frontend-6fx4.onrender.com',
    codeUrl: 'https://github.com/rohit6522/resume-analyzer-frontend',
},
  {
  title: 'FlixGenie',
  summary: 'An AI-powered movie discovery platform — Netflix meets ChatGPT, with real-time recommendations, trailers, and a watchlist.',
  images: [
  '/projects/Flix/FlixGenie.jpg',
  '/projects/Flix/FlixGenie1.jpg',
  '/projects/Flix/FlixGenie2.jpg',
  '/projects/Flix/FlixGenie3.jpg'
],
  category: 'Web Apps',
  period: 'Jul 2026 – Present',
  tags: ['React', 'Redux', 'Node.js', 'Firebase', 'Groq AI'],
  liveUrl: 'https://flixgenie-frontend.onrender.com',
  codeUrl: 'https://github.com/rohit6522/FlixGenie',
},
 {
  title: 'AI Interview Prep Platform',
  summary: 'A full-stack platform that generates AI-powered interview questions, evaluates spoken or typed answers in real time, and tracks score progress across sessions.',
  images: [
    '/projects/AiInterview/AIInterviewPrep.jpg',
    '/projects/AiInterview/AIInterviewPrep1.jpg',
    '/projects/AiInterview/AIInterviewPrep2.jpg',
    '/projects/AiInterview/AIInterviewPrep3.jpg',
  ],
  category: 'Web Apps',
  period: 'Jul 2026 – Present',
  tags: ['React', 'Node.js', 'PostgreSQL', 'Gemini API', 'Framer Motion'],
  liveUrl: 'https://ai-interview-platform-real-frontend.onrender.com',
  codeUrl: 'https://github.com/rohit6522/ai-interview-platform',
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
  
]

export const experience = [
  {
    role: 'DSA Placement Bootcamp — Master Data Structures and Algorithms',
    company: 'Lovely Professional University',
    period: 'Jun 2026 — Jul 2026',
    certificateUrl: 'https://drive.google.com/file/d/1LiwlqGSTLMgMGJUI5qPywbJXeOOk6VRM/view?usp=drive_link',
    points: [
      'Developed strong problem-solving and analytical skills through structured Data Structures and Algorithms practice.',
      'Practiced identifying problem patterns, selecting appropriate algorithms, and optimizing solutions.',
      'Solved placement and interview-oriented DSA problems using efficient approaches and optimization techniques.',
    ],
  },
]
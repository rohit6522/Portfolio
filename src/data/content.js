
export const profile = {
  name: 'Rohit Kumar',
  role: 'Full-Stack Developer',
  rolePhrases: [
    'Full-Stack Developer',
    'React Developer',
    'Problem Solver',
    'UI/UX Enthusiast',
  ],

  tagline:
    'I design and build web systems end to end — from database schema to the pixel you click on.',
  bio:
    "I love building things that actually work — clean code, functional apps, real solutions to real problems. I'm not here to write code that just runs; I build things that reduce friction, cut the noise, and make life easier for the people using them.",
  shortLine: "Clean code. Functional apps. Less pain points. That's the whole vibe.",


  location: 'Patna, Bihar',
  email: 'rohitrajyadav6522@gmail.com',

  resumeUrl: '/resume.pdf',
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

// export const stackNodes = [
//   'React',
//   'Node.js',
//   'MySQL',
//   'JavaScript',
//   'AWS',
//   'Docker',
// ]

export const education = [
  {
    school: 'Lovely Professional University (current)',
    degree: 'B.Tech in Computer Science & Engineering',
    period: '2024 — 2028',
    description: 'Currently pursuing an undergraduate program in computer science with a focus on software development and system design.',
  },
  {
    school: 'Jan Sahkari College',
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

  {
    title: 'DSA Placement Bootcamp: Master Data Structures & Algorithms for Industry',
    issuer: 'Centre for Professional Enhancement — Lovely Professional University',
    date: 'June 2026 – July 2026',
    credentialUrl: 'https://drive.google.com/file/d/1LiwlqGSTLMgMGJUI5qPywbJXeOOk6VRM/view?usp=drive_link',
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
    category: 'Frontend',
    items: ['HTML', 'CSS', 'React', 'Tailwind CSS'],
  },
  {
    category: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'SQL'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication'],
  },
  {
    category: 'Database',
    items: ['MySQL', 'MongoDB'],
  },

  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Postman'],
  },
]


export const projects = [
  {
    title: 'Smart Cart — Budget-Aware Shopping Platform',
        caseStudy: {
      slug: 'smart-cart',
      role: 'Full-stack developer',
      problem:
        'Online shoppers may struggle to keep their spending within a fixed budget while adding products to their cart. The project aims to make budget tracking easier during the shopping and checkout process.',
      solution:
        'Built a full-stack shopping platform with a real-time budget tracker, role-based authentication, payment options, and order management. The platform also includes dedicated dashboards for shoppers, administrators, and delivery partners.',
      challenges: [
        {
          title: 'Real-time budget tracking',
          detail:
            'Implemented a cart budget tracker with a progress indicator and over-budget alerts so shoppers can monitor their spending as they add products.',
        },
        {
          title: 'Order and role management',
          detail:
            'Designed separate workflows for shoppers, administrators, and delivery partners to support product management, order processing, and delivery assignment.',
        },
      ],
      outcome: [
        'Built a full-stack eCommerce application with shopping, checkout, and order-management features.',
        'Integrated Razorpay with a Cash-on-Delivery fallback.',
      ],
    },
    category: 'Full-Stack Web Application',
    period: 'Jul 2026 – Aug 2026',
    featured: true,
    status: 'COMPLETED',
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
    images: ['/projects/Ecom/smartCart.jpg', '/projects/Ecom/smartCart1.jpg', '/projects/Ecom/smartCart2.jpg', '/projects/Ecom/smartCart3.jpg', '/projects/Ecom/smartCart4.jpg'],

    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Razorpay'],

    liveUrl: 'https://smartcart-frontend-g472.onrender.com/',
    codeUrl: 'https://github.com/rohit6522/smart-cart-ecommerce',
  },

  {
    title: 'Smart Hospital Emergency System',
        caseStudy: {
      slug: 'smart-hospital',
      role: 'Full-stack developer',
      problem:
        'Emergency response requires timely coordination between incoming cases, ambulances, and hospital resources. This project explores how a web-based system can support emergency routing and improve visibility into available resources.',
      solution:
        'Built a web application focused on emergency routing, ambulance tracking, and hospital resource management, using a React frontend and Java-based backend services.',
      challenges: [
        {
          title: 'Emergency routing and coordination',
          detail:
            'Worked on the emergency routing logic and the flow of information between the frontend and backend to support emergency case handling.',
        },
        {
          title: 'Live tracking and resource visibility',
          detail:
            'Worked on tracking and resource-management features to help users monitor ambulance movement and hospital resources.',
        },
      ],
      outcome: [
        'Built a web application focused on emergency response and hospital coordination.',
        'Implemented the features that are currently available in the project.',
      ],
    },
    category: 'Web Application',
    period: 'Jul 2026 – Sep 2026',
    featured: true,
    status: 'COMPLETED',
    summary:
      'An AI-powered emergency response and routing system that helps hospitals triage and route incoming emergencies faster.',
    features: [
      'AI-assisted emergency routing logic',
      'Live ambulance tracking and dynamic hospital resource management',
      'React frontend with Java backend services',
    ],
    images: ['/projects/Hospital/hospital.jpg', '/projects/Hospital/hospital1.jpg', '/projects/Hospital/hospital2.jpg', '/projects/Hospital/hospital3.jpg', '/projects/Hospital/hospital4.jpg', '/projects/Hospital/hospital5.jpg'],
    tags: ['React', 'Java', 'Spring Boot', 'Tailwind CSS', 'MySQL', 'WebSocket'],
    liveUrl: 'https://smart-hospital-frontend-wcd3.onrender.com/',
    codeUrl: 'https://github.com/rohit6522/smart-hospital-emergency-system',
  },

  {
    title: 'Fitness Training Portal',
       caseStudy: {
      slug: 'fitness-portal',
      role: 'Full-stack developer',
      problem:
        'Managing workout schedules, fitness goals, and daily activity can be difficult when information is spread across different tools. This project aims to bring workout planning and progress tracking together in one application.',
      solution:
        'Built a fitness platform using React, Node.js, Express.js, and MongoDB. It includes personalized workout planning, progress and goal tracking, daily streaks, calorie and water tracking, and user authentication.',
      challenges: [
        {
          title: 'Workout and progress management',
          detail:
            'Organized workout plans and fitness progress features so users can manage their training schedules and monitor their goals in one place.',
        },
        {
          title: 'Authentication and user access',
          detail:
            'Worked with the authentication flow using the technologies implemented in the project to support secure user access.',
        },
      ],
      outcome: [
        'Built a fitness web application with workout planning and progress-tracking features.',
        'Implemented fitness tracking and authentication features included in the project.',
      ],
    },

    category: 'Web Application',
    period: 'March – May 2026',
    featured: true,
    status: 'COMPLETED',
    summary:
      'A modern full-stack fitness platform that helps users plan workouts, monitor progress, follow personalized training schedules, and securely manage their accounts with authentication and real-time data.',

    features: [
      'Personalized workout plan builder',
      'Real-time progress & goal tracking',
      'Secure auth with JWT & Firebase',
      'Daily streak, calorie & water tracking',
    ],
    images: ['/projects/Fittnesss/fitness.jpg', '/projects/Fittnesss/Fitness1.jpg', '/projects/Fittnesss/Fitness2.jpg'],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],

    liveUrl: 'https://fitnessapp-frontend-xiht.onrender.com',
    codeUrl: 'https://github.com/rohit6522/FitnessApp',
  },
  {
    title: 'RYDEX',
        caseStudy: {
      slug: 'rydex',
      role: 'Full-stack developer',
      problem:
        'Booking a vehicle requires a smooth connection between riders and drivers, along with reliable ride-status updates. RYDEX aims to bring booking, live ride tracking, driver verification, and payment options together in one platform.',
      solution:
        'Built a vehicle-booking platform inspired by ride-hailing apps, with live GPS tracking, Socket.io-based ride updates, OTP-verified ride starts, and Razorpay or cash payment options. The platform also includes driver onboarding with video KYC and an admin approval workflow.',
      challenges: [
        {
          title: 'Real-time ride tracking',
          detail:
            'Worked on coordinating live location updates and ride-status changes so users can follow the ride in real time.',
        },
        {
          title: 'Driver verification workflow',
          detail:
            'Designed the driver onboarding flow around video KYC and admin approval to support driver verification before accepting rides.',
        },
      ],
      outcome: [
        'Developed a vehicle-booking application with real-time tracking and ride-management features.',
        'Integrated the payment and driver-onboarding workflows implemented in the project.',
      ],
    },
    category: 'Web Application',
    period: 'Jul 2026 - Present',
    featured: true,
    status: 'IN PROGRESS',

    summary:
      'A full-stack, real-time vehicle-booking platform (Uber/Rapido-style) with live GPS tracking, video KYC driver verification, and dual payment options.',
    features: [
      'Real-time ride tracking & live GPS via Socket.io',
      'OTP-verified ride start, Razorpay + cash payments',
      'Driver onboarding with video KYC (ZegoCloud) & admin approval',
    ],
    images: ['/projects/Rydex/rydex-1.jpg', '/projects/Rydex/rydex-2.jpg', '/projects/Rydex/rydex-3.jpg', '/projects/Rydex/rydex-4.jpg', '/projects/Rydex/rydex-5.jpg', '/projects/Rydex/rydex-6.jpg'],
    tags: ['Next.js', 'MongoDB', 'Socket.io', 'Razorpay', 'Leaflet'],
    liveUrl: 'https://rydex-eo9t.onrender.com/',
    codeUrl: 'https://github.com/rohit6522/vehicle-booking-app',
  },
]

export const achievements = [
  { icon: '</>', label: 'Coding Platforms', stat: '250+ Solved', highlight: false },
  // { icon: '★', label: 'C++ · HackerRank', stat: '5-Star Status', highlight: false },
  // { icon: '🏅', label: 'National Ranking', stat: '13th Rank, India', highlight: true },
]

export const archiveCategories = ['Web Apps', 'Mobile Apps']

export const archiveProjects = [
  {
    title: 'ResumeAI — AI Resume Analyzer',
    summary: 'A full-stack SaaS platform that parses resumes (PDF/DOCX), generates AI-powered ATS scores, and matches resumes against job descriptions using Gemini AI. Built with JWT authentication, PDF report generation, and a fully responsive UI.',
    images: ['/projects/AiResume/Resume.jpg', '/projects/AiResume/Resume1.jpg', '/projects/AiResume/Resume2.jpg', '/projects/AiResume/Resume3.jpg'],
    category: 'Web Apps',
    period: 'Jul 2026 – Aug 2026',
    tags: ['React', 'Spring Boot', 'PostgreSQL', 'Gemini AI'],
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
    period: 'Jul 2026 – Sep 2026',
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
    period: 'Jul 2026 – Aug 2026',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Gemini API'],
    liveUrl: 'https://ai-interview-platform-real-frontend.onrender.com',
    codeUrl: 'https://github.com/rohit6522/ai-interview-platform',
  },

  // {
  //   title: 'Wanderlog',
  //   summary: 'A trip-planning app that syncs itineraries across devices, even offline.',
  //   category: 'Mobile Apps',
  //   tags: ['React Native', 'SQLite'],
  //   liveUrl: '#',
  //   codeUrl: '#',
  // },
  // {
  //   title: 'Focusly',
  //   summary: 'A minimalist Pomodoro and habit tracker with home-screen widgets.',
  //   category: 'Mobile Apps',
  //   tags: ['Flutter', 'Firebase'],
  //   liveUrl: '#',
  //   codeUrl: '#',
  // },

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


// Hero badge: open:false karne par badge hide ho jata hai
export const availability = {
  open: true,
  text: 'Open to internships and junior roles',
}
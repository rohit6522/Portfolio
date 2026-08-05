# Rohit Kumar — Developer Portfolio

A fully custom, animated developer portfolio built with React and Vite. Features a live GitHub/LeetCode contribution graph, automated daily stats via GitHub Actions, 3D tilt cards, a custom cursor, inertia-based smooth scrolling, and a typewriter-style loading screen.

**Live site:** [portfolio-k6bd.onrender.com](https://portfolio-k6bd.onrender.com)

---

## Tech Stack

| Category | Tools |
|---|---|
| Framework | React 18 + Vite |
| Animation | Framer Motion, GSAP (ScrollTrigger) |
| Smooth Scroll | Lenis |
| Styling | Plain CSS with custom properties (no framework) |
| Fonts | Poppins, Inter, IBM Plex Mono |
| Automation | GitHub Actions (daily LeetCode stats fetch) |
| Hosting | Render (static site) |

## Features

- **Hero section** — cursor-reactive glow name effect, typewriter-style letter reveal, floating terminal badges on photo hover
- **Skills / Education / Experience / Certifications** — single tabbed section with directional slide transitions and 3D tilt cards
- **Projects** — flip cards (image front, key-features back on hover), auto-advancing image carousel, collapsible project archive by category
- **Contribution Graph** — GitHub and LeetCode activity heatmaps with year selector, live streak/rank/solved stats
- **Achievements** — animated count-up stat cards
- **Contact** — Calendly-powered meeting scheduler
- **Custom cursor**, **inertia smooth scroll**, **animated canvas background**, **mobile hamburger nav**, **scroll-based floating pill navbar**

## Project Structure

```
portfolio/
├── .github/workflows/
│   └── leetcode-stats.yml      # Daily automated LeetCode stats fetch
├── public/
│   ├── avatar.jpg              # Profile photo (used in nav + hero)
│   ├── resume.pdf              # Downloadable resume
│   ├── leetcode-stats.json     # Auto-updated by GitHub Action
│   ├── certs/                  # Certificate images
│   └── projects/               # Project screenshots
├── scripts/
│   └── fetch-leetcode-stats.mjs
├── src/
│   ├── components/             # All UI components
│   ├── data/
│   │   └── content.js          # ⭐ All editable site content lives here
│   ├── hooks/                  # Custom React hooks
│   ├── App.jsx
│   ├── index.css               # All styling (design tokens + components)
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

```bash
# install dependencies
npm install

# run locally
npm run dev

# build for production
npm run build
```

## Editing Content

Almost everything on the site is data-driven from **`src/data/content.js`** — name, bio, skills, projects, education, certifications, achievements, and social links. Edit that file to personalize the site; you shouldn't need to touch component files for normal content updates.

To update:
- **Profile photo** → replace `public/avatar.jpg`
- **Resume** → replace `public/resume.pdf`
- **Project screenshots** → add to `public/projects/` and reference in `content.js`
- **Certificates** → add to `public/certs/` and reference in `content.js`

## LeetCode Automation

`scripts/fetch-leetcode-stats.mjs` fetches solve counts, submission calendar, and global rank from LeetCode's public GraphQL API, then writes `public/leetcode-stats.json`. The GitHub Action in `.github/workflows/leetcode-stats.yml` runs this daily at midnight UTC and commits the result — which triggers an automatic Render redeploy.

**Requires:** repo setting **Settings → Actions → General → Workflow permissions → Read and write permissions**, so the Action can commit back to `main`.

To trigger manually: **Actions tab → Update LeetCode Stats → Run workflow**.

## Deployment

Hosted on [Render](https://render.com) as a static site:
- **Build command:** `npm install; npm run build`
- **Publish directory:** `./dist`

Every push to `main` (including automated commits from the LeetCode Action) triggers an automatic redeploy.

## License

Personal portfolio — feel free to reference the structure, but please don't copy the content or design wholesale.

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projects, achievements } from '../data/content'
import RollingText from './RollingText'
import AnimatedStat from './AnimatedStat'
import MagneticText from './MagneticText'
import IconBadge, { FolderIcon, AwardIcon } from './IconBadge'
import { Reveal, RevealItem } from './Reveal'

const statusConfig = {
  STABLE: { label: 'Completed', className: 'status-completed' },
  'IN PROGRESS': { label: 'In Progress', className: 'status-progress' },
  PLANNED: { label: 'Planned', className: 'status-planned' },
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z" />
    </svg>
  )
}

function HackerRankLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <rect width="24" height="24" rx="5" fill="#2EC866" />
      <path d="M7 6v12h2.8v-4.6h4.4V18H17V6h-2.8v4.6H9.8V6H7Z" fill="#111" />
    </svg>
  )
}

function LeetCodeLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

function GfgLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
    </svg>
  )
}

function CodeTrophyLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1l-.8.9H5a2 2 0 0 0-2 2v2a5 5 0 0 0 4.5 5 5 5 0 0 0 3.5 1.9V20H8v2h8v-2h-3v-1.1c1.5-.3 2.7-1 3.5-1.9A5 5 0 0 0 21 12V9a2 2 0 0 0-2-2h-4l-.8-.9c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3Zm-7 7h3v3a3 3 0 0 1-3-3V9Zm11 0h3v3a3 3 0 0 1-3 3V9Z" />
    </svg>
  )
}

function DsaShowcaseCard({ achievement }) {
  const getItemIcon = (type) => {
    if (type === 'leetcode') return <LeetCodeLogo />
    if (type === 'gfg') return <GfgLogo />
    return <CodeTrophyLogo />
  }

  return (
    <div className="achievement-card achievement-showcase-card achievement-dsa-card achievement-highlight">
      <div className="hackerrank-card-header">
        <div className="hackerrank-card-title-wrap">
          <span className="dsa-card-brand-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
            </svg>
          </span>
          <div>
            <span className="achievement-label">{achievement.label}</span>
            <span className="dsa-card-sub">{achievement.subTitle || 'LeetCode & GeeksforGeeks'}</span>
          </div>
        </div>

        {achievement.profileUrl && (
          <a
            href={achievement.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="hackerrank-profile-link leetcode-profile-link"
            title="View Rohit's LeetCode profile"
          >
            @{achievement.username || 'rohit6522'}
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      <div className="hackerrank-badges-row">
        {achievement.items?.map((item) => (
          <div key={item.name} className="hackerrank-badge-item">
            <div className="hackerrank-hexagon-wrap">
              <div className="hackerrank-hexagon-border">
                <div className="hackerrank-hexagon-inner">
                  <span className="hackerrank-badge-icon">
                    {getItemIcon(item.type)}
                  </span>
                  <span className="hackerrank-badge-name">{item.name}</span>
                  <span className="dsa-hexagon-stat">{item.stat}</span>
                </div>
              </div>
            </div>
            <span className="hackerrank-badge-level">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function JavaLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M19.5 7h-1.3A6 6 0 0 0 12 3.8a6 6 0 0 0-6.2 3.2H4.5a2 2 0 0 0-2 2v3a5 5 0 0 0 4.5 5 6 6 0 0 0 5 2.8 6 6 0 0 0 5.8-4.5c.2 0 .5.03.7.03a4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 19.5 7ZM7 12V9h10v3a3.5 3.5 0 0 1-7 0v-.5h-2v.5a3.5 3.5 0 0 1-1 0Zm12.5-1.5c-1.4 0-2.5-1.1-2.5-2.5h2.5v2.5ZM4 20h16v1.8H4V20Z" />
    </svg>
  )
}

function PythonLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M11.9 2c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6H5.7S2 6.1 2 10.5c0 4.4 3.3 4.3 3.3 4.3h1.9v-2.7s-.1-3.3 3.2-3.3h5.5s3.1.1 3.1-3c0-3.1-2.7-3.8-7.1-3.8Zm-2.3 1.2c.4 0 .8.3.8.8 0 .4-.4.8-.8.8s-.8-.4-.8-.8c0-.5.4-.8.8-.8Zm2.5 18.8c4.4 0 4.1-1.9 4.1-1.9l-.01-2H12v-.6h6.3s3.7.4 3.7-4c0-4.4-3.3-4.3-3.3-4.3h-1.9v2.7s.1 3.3-3.2 3.3H8.1s-3.1-.1-3.1 3c0 3.1 2.7 3.8 7.1 3.8Zm2.3-1.2c-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8s.8.4.8.8c0 .5-.4.8-.8.8Z" />
    </svg>
  )
}

function SqlLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 3C7.6 3 4 4.3 4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.9 0 6 1.1 6 1s-2.1 1-6 1-6-1-6-1 2.1-1 6-1Zm6 4.9c-.9 1-3.3 1.6-6 1.6s-5.1-.6-6-1.6V8.2c1.4.9 3.7 1.5 6 1.5s4.6-.6 6-1.5v1.7Zm0 4c-.9 1-3.3 1.6-6 1.6s-5.1-.6-6-1.6v-1.7c1.4.9 3.7 1.5 6 1.5s4.6-.6 6-1.5v1.7Zm0 4c-.9 1-3.3 1.6-6 1.6s-5.1-.6-6-1.6v-1.7c1.4.9 3.7 1.5 6 1.5s4.6-.6 6-1.5v1.7Z" />
    </svg>
  )
}

function HackerRankShowcaseCard({ achievement }) {
  const getBadgeIcon = (icon) => {
    if (icon === 'python') return <PythonLogo />
    if (icon === 'java') return <JavaLogo />
    return <SqlLogo />
  }

  return (
    <div className="achievement-card achievement-showcase-card achievement-hackerrank-card achievement-highlight">
      <div className="hackerrank-card-header">
        <div className="hackerrank-card-title-wrap">
          <HackerRankLogo />
          <div>
            <span className="achievement-label">{achievement.label}</span>
            <span className="hackerrank-card-sub">Verified Skill Badges</span>
          </div>
        </div>

        {achievement.profileUrl && (
          <a
            href={achievement.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="hackerrank-profile-link"
            title="View Rohit's HackerRank profile"
          >
            @{achievement.username || 'rohitrajyadav651'}
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      <div className="hackerrank-badges-row">
        {achievement.badges?.map((badge) => (
          <div key={badge.name} className="hackerrank-badge-item">
            <div className="hackerrank-hexagon-wrap">
              <div className="hackerrank-hexagon-border">
                <div className="hackerrank-hexagon-inner">
                  <span className="hackerrank-badge-icon">
                    {getBadgeIcon(badge.icon)}
                  </span>
                  <span className="hackerrank-badge-name">{badge.name}</span>
                  <div className="hackerrank-badge-stars">
                    {Array.from({ length: badge.stars }).map((_, i) => (
                      <span key={i} className="hackerrank-star">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <span className="hackerrank-badge-level">
              {badge.stars} {badge.stars === 1 ? 'Star' : 'Stars'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProjectCard({ project, compact = false }) {
  const images = project.images || []
  const features = project.features || []
  const [imgIndex, setImgIndex] = useState(0)
  const status = statusConfig[project.status] || statusConfig.STABLE

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setImgIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      )
    }, 3500)

    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className={`project-card-v3 ${compact ? 'project-card-compact' : ''}`}>
      {images.length > 0 && (
        <div className="project-flip-outer">
          <div className="project-flip-inner">
            <div className="project-flip-face project-flip-front">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 1} of ${images.length}`}
                  className="project-cover-img"
                  loading="lazy"
                  decoding="async"
                  style={{ opacity: i === imgIndex ? 1 : 0 }}
                />
              ))}

              <div className="project-cover-overlay" />
              <span className="project-cover-title">
                {project.title}
              </span>

              <span className="project-hover-pill">
                Hover <span>›</span>
              </span>

              {images.length > 1 && (
                <div className="project-cover-dots">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`project-cover-dot ${i === imgIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="project-flip-face project-flip-back">
              {project.summary && (
                <p className="features-panel-summary">
                  {project.summary}
                </p>
              )}

              {features.length > 0 && (
                <>
                  <div className="features-panel-label">
                    <span>✓</span> Key Features
                  </div>

                  <ul className="features-panel-list">
                    {features.map((feature, i) => (
                      <li key={i}>
                        <span className="features-panel-dot" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="project-footer-v3">
        <div className="project-meta-row-v3">
          {project.category && (
            <span className="project-meta-pill">
              {project.category}
            </span>
          )}

          <span className={`project-meta-pill ${status.className}`}>
            {status.label}
          </span>

          {project.period && (
            <span className="project-meta-period">
              {project.period}
            </span>
          )}
        </div>

        {project.tags?.length > 0 && (
          <div className="project-tags-row-v3">
            {project.tags.map((tag) => (
              <span className="project-tag-pill-v3" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="project-links-row-v3">
          {project.caseStudy && (
            <button
              type="button"
              className="project-link-btn-v3 project-case-btn"
              onClick={() => {
                window.location.hash = `case-${project.caseStudy.slug}`
              }}
            >
              Case study →
            </button>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="project-link-btn-v3"
            >
              <GithubIcon /> GitHub
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-link-btn-v3"
            >
              <GlobeIcon /> Live
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const liveAchievements = achievements

  const openArchivePage = () => {
    window.location.hash = 'archive'
  }

  return (
    <section id="projects" className="section section-dark">
      <div className="container">
        <Reveal>
          <RevealItem>
            <div className="section-head-row">
              <IconBadge>
                <FolderIcon />
              </IconBadge>

              <div>
                <h2 className="section-title" style={{ marginTop: '4px' }}>
                  <MagneticText>
                    Personal Project
                  </MagneticText>
                </h2>
              </div>
            </div>
          </RevealItem>

          <div className="projects-grid-v3">
            {projects.map((project) => (
              <RevealItem key={project.title}>
                <ProjectCard project={project} />
              </RevealItem>
            ))}
          </div>

          <RevealItem>
            <div className="archive-toggle-wrap">
              <motion.button
                type="button"
                className="archive-toggle"
                onClick={openArchivePage}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                [
                <RollingText text="ACCESS_ARCHIVE" />
                ]
                <span aria-hidden="true">→</span>
              </motion.button>
            </div>
          </RevealItem>

          <RevealItem>
            <div
              id="achievements"
              className="section-head-row"
              style={{ marginTop: '72px' }}
            >
              <IconBadge>
                <AwardIcon />
              </IconBadge>

              <div>
                <h3
                  className="achievements-title"
                  style={{ marginTop: '4px', marginBottom: 0 }}
                >
                  <MagneticText>
                    Key achievements
                  </MagneticText>
                </h3>
              </div>
            </div>
          </RevealItem>

          <div className="achievements-grid">
            {liveAchievements.map((achievement, idx) => {
              if (achievement.type === 'dsa-showcase') {
                return (
                  <RevealItem key={achievement.label || idx}>
                    <DsaShowcaseCard achievement={achievement} />
                  </RevealItem>
                )
              }

              if (achievement.type === 'hackerrank-showcase') {
                return (
                  <RevealItem key={achievement.label || idx}>
                    <HackerRankShowcaseCard achievement={achievement} />
                  </RevealItem>
                )
              }

              return (
                <RevealItem key={achievement.label || idx}>
                  <div
                    className={`achievement-card ${achievement.highlight ? 'achievement-highlight' : ''}`}
                  >
                    <span className="achievement-icon">
                      {achievement.icon}
                    </span>

                    <span className="achievement-label">
                      {achievement.label}
                    </span>

                    <span className="achievement-stat">
                      <AnimatedStat value={achievement.stat} />
                    </span>

                    {achievement.sub && (
                      <span className="achievement-sub">
                        {achievement.sub}
                      </span>
                    )}
                  </div>
                </RevealItem>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

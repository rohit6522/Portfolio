import { profile } from '../data/content'

export default function Footer() {
  const github = profile.social.find((s) => s.label === 'GitHub')

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-v2">
      <div className="container footer-v2-inner">
        <p className="footer-tagline">
          Built with modern web technologies and a focus on clean and performant code
        </p>

        <p className="footer-made-with">
          Made with <span className="footer-heart">♥</span> and <span className="footer-coffee">☕</span> by{' '}
          {profile.name.split(' ')[0]}
        </p>

        <div className="footer-links-row">
          {github && (
            <a href={github.url} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          <span className="footer-dot">•</span>
          <button onClick={scrollToTop} className="footer-scroll-btn">
            Scroll to top
          </button>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} • All rights reserved
        </p>
      </div>
    </footer>
  )
}
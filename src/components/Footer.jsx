import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer container">
      <span>© {new Date().getFullYear()} {profile.name} ALL RIGHTS RESERVED.</span>
      <span>Built with React</span>
    </footer>
  )
}

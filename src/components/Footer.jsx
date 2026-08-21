import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer-v2">
      <div className="container footer-v2-inner">
        <p className="footer-tagline">
          Built with modern web technologies and a focus on clean and performant code
        </p>

                <p className="footer-console-log">
          console.log(<span className="footer-console-string">"Thanks for visiting!"</span>);
        </p>

       

        <p className="footer-copyright">
          © {new Date().getFullYear()} • All rights reserved
        </p>
      </div>
    </footer>
  )
}
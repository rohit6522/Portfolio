import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiOpenjdk,
  SiC,
  SiCplusplus,
  SiMysql,
  SiHtml5,
  SiCss,
  SiReact,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiJsonwebtokens,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiNextdotjs,
  SiRedux,
  SiGraphql,
  SiDocker,
  SiFirebase,
} from 'react-icons/si'
import { VscSymbolMisc, VscVscode } from 'react-icons/vsc'

const iconMap = {
  Python: { icon: SiPython, color: '#3776AB' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  Java: { icon: SiOpenjdk, color: '#EA2D2E' },
  C: { icon: SiC, color: '#A8B9CC' },
  'C++': { icon: SiCplusplus, color: '#00599C' },
  SQL: { icon: SiMysql, color: '#4479A1' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  HTML: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#1572B6' },
  React: { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  Vite: { icon: SiVite, color: '#646CFF' },
  Redux: { icon: SiRedux, color: '#764ABC' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'Express.js': { icon: SiExpress, color: '#ffffff' },
  Express: { icon: SiExpress, color: '#ffffff' },
  'REST APIs': { icon: VscSymbolMisc, color: '#22d3ee' },
  'JWT Authentication': { icon: SiJsonwebtokens, color: '#000000' },
  JWT: { icon: SiJsonwebtokens, color: '#ffffff' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  GraphQL: { icon: SiGraphql, color: '#E10098' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  Firebase: { icon: SiFirebase, color: '#FFCA28' },
  Git: { icon: SiGit, color: '#F05032' },
  GitHub: { icon: SiGithub, color: '#ffffff' },
  'VS Code': { icon: VscVscode, color: '#007ACC' },
  Postman: { icon: SiPostman, color: '#FF6C37' },
}

export default function SkillIcon({ name }) {
  const entry = iconMap[name]
  if (!entry) return null
  const Icon = entry.icon
  return <Icon size={14} color={entry.color} style={{ flexShrink: 0 }} />
}
import {
  SiPython,
  SiJavascript,
  SiTypescript,
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
import { FaJava } from 'react-icons/fa6'
import { TbDatabase, TbApi } from 'react-icons/tb'
import { VscVscode } from 'react-icons/vsc'

const iconMap = {
  Python: { icon: SiPython, color: '#3776AB' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  Java: { icon: FaJava, color: '#F89820' },
  C: { icon: SiC, color: '#659AD2' },
  'C++': { icon: SiCplusplus, color: '#00599C' },
  SQL: { icon: TbDatabase, color: '#0088CC' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  HTML: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#264DE4' },
  React: { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#FFFFFF' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#38BDF8' },
  Vite: { icon: SiVite, color: '#646CFF' },
  Redux: { icon: SiRedux, color: '#764ABC' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
  'Express.js': { icon: SiExpress, color: '#E2E8F0' },
  Express: { icon: SiExpress, color: '#E2E8F0' },
  'REST APIs': { icon: TbApi, color: '#22D3EE' },
  'JWT Authentication': { icon: SiJsonwebtokens, color: '#D63AFF' },
  JWT: { icon: SiJsonwebtokens, color: '#D63AFF' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  GraphQL: { icon: SiGraphql, color: '#E10098' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  Firebase: { icon: SiFirebase, color: '#FFCA28' },
  Git: { icon: SiGit, color: '#F05032' },
  GitHub: { icon: SiGithub, color: '#F0F6FC' },
  'VS Code': { icon: VscVscode, color: '#007ACC' },
  Postman: { icon: SiPostman, color: '#FF6C37' },
}

export default function SkillIcon({ name }) {
  const entry = iconMap[name]
  if (!entry) return null
  const Icon = entry.icon
  return <Icon size={18} color={entry.color} style={{ flexShrink: 0 }} />
}

// import { useEffect, useState } from 'react'

// export default function useTheme() {
//   const [theme, setTheme] = useState(() => {
//     const saved = localStorage.getItem('portfolio-theme')
//     if (saved) return saved
//     return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
//   })

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme)
//     localStorage.setItem('portfolio-theme', theme)
//   }, [theme])

//   function toggleTheme() {
//     setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
//   }

//   return { theme, toggleTheme }
// }
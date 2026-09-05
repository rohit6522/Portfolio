// import useTheme from '../hooks/useTheme'

// function SunIcon() {
//   return (
//     <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
//       <circle cx="12" cy="12" r="4.5" />
//       <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
//     </svg>
//   )
// }

// function MoonIcon() {
//   return (
//     <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
//     </svg>
//   )
// }

// export default function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme()

//   return (
//     <button
//       className="theme-toggle-btn"
//       onClick={toggleTheme}
//       aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//     >
//       {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
//     </button>
//   )
// }
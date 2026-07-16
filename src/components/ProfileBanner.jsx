// import { motion } from 'framer-motion'
// import { profile } from '../data/content'

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, delay: 0.15 * i, ease: 'easeOut' },
//   }),
// }

// export default function ProfileBanner() {
//   return (
//     <section className="profile-banner">
//       <motion.img
//         src="/mee.jpg"
//         alt={profile.name}
//         className="profile-banner-img"
//         initial={{ opacity: 0, scale: 1.06 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 1, ease: 'easeOut' }}
//       />
//       <div className="profile-banner-overlay" />

//       <div className="profile-banner-content container">
//         <motion.div
//           className="profile-banner-tag"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           custom={0}
//           variants={fadeUp}
//         >
//           <span className="profile-banner-dash" />
//           SYSTEM_SESSION_ACTIVE
//         </motion.div>

//         <motion.h2
//           className="profile-banner-name"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           custom={1}
//           variants={fadeUp}
//         >
//           {profile.name.split(' ')[0]}
//           <br />
//           {profile.name.split(' ').slice(1).join(' ')}
//         </motion.h2>

//         <motion.p
//           className="profile-banner-role"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           custom={2}
//           variants={fadeUp}
//         >
//           {profile.role.toUpperCase()} — {profile.tagline}
//         </motion.p>
//       </div>
//     </section>
//   )
// }
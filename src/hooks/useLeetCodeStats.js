import { useEffect, useState } from 'react'

export default function useLeetCodeStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/leetcode-stats.json')
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null))
  }, [])

  return stats
}
import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import IconBadge, { CodeIcon } from './IconBadge'
import MagneticText from './MagneticText'

function GithubLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function LeetCodeLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M13.48 2.3 6.1 9.68a3.5 3.5 0 0 0 0 4.95l4.66 4.66a3.5 3.5 0 0 0 4.95 0l2.2-2.2a1.1 1.1 0 0 0-1.56-1.56l-2.2 2.2a1.3 1.3 0 0 1-1.83 0l-4.66-4.66a1.3 1.3 0 0 1 0-1.83l7.38-7.38A1.1 1.1 0 0 0 13.48 2.3Z"
        fill="#FFA116"
      />
      <path
        d="M9.5 12.5h9a1.1 1.1 0 0 0 0-2.2h-9a1.1 1.1 0 0 0 0 2.2Z"
        fill="#000000"
      />
    </svg>
  )
}


const currentYear = new Date().getFullYear()
const years = [currentYear, currentYear - 1, currentYear - 2]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function levelFromCount(count, thresholds) {
  if (count === 0) return 0
  if (count <= thresholds[0]) return 1
  if (count <= thresholds[1]) return 2
  if (count <= thresholds[2]) return 3
  return 4
}

function buildYearGrid(dateCountMap, year, thresholds) {
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year, 11, 31))
  const startDay = start.getUTCDay()
  const days = []

  for (let i = 0; i < startDay; i++) days.push(null)

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    const count = dateCountMap[key] || 0
    days.push({
      date: key,
      count,
      level: levelFromCount(count, thresholds),
      month: d.getUTCMonth(),
    })
  }

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstReal = week.find((d) => d)
    if (firstReal && firstReal.month !== lastMonth) {
      monthLabels.push({ index: wi, label: months[firstReal.month] })
      lastMonth = firstReal.month
    }
  })

  return { weeks, monthLabels, weekCount: weeks.length }
}

function computeClientStreak(dateCountMap) {
  let streak = 0
  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)

  let key = cursor.toISOString().slice(0, 10)
  if (!dateCountMap[key]) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  while (true) {
    key = cursor.toISOString().slice(0, 10)
    if (dateCountMap[key] > 0) {
      streak++
      cursor.setUTCDate(cursor.getUTCDate() - 1)
    } else {
      break
    }
  }
  return streak
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

export default function ContributionGraph() {
  const [platform, setPlatform] = useState('github')
  const [year, setYear] = useState(currentYear)
  const [loading, setLoading] = useState(true)
  const [grid, setGrid] = useState({ weeks: [], monthLabels: [], weekCount: 52 })
  const [total, setTotal] = useState(0)
  const [statCards, setStatCards] = useState(null)
  const [error, setError] = useState(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function loadGithub() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${profile.githubUsername}?y=${year}`
        )
        if (!res.ok) throw new Error('GitHub API request failed')
        const data = await res.json()
        const map = {}
        ;(data.contributions || []).forEach((c) => {
          map[c.date] = c.count
        })
        if (cancelled) return
        setGrid(buildYearGrid(map, year, [3, 6, 10]))
        const yearTotal = data.total?.[year] ?? Object.values(map).reduce((a, b) => a + b, 0)
        setTotal(yearTotal)
        setStatCards({
          streak: computeClientStreak(map),
          middle: { label: 'total contributions', value: yearTotal },
          third: { label: 'active days', value: Object.values(map).filter((v) => v > 0).length },
        })
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [], weekCount: 52 })
          setTotal(0)
          setStatCards(null)
          setError('github')
        }
      }
    }

    async function loadLeetcode() {
      try {
        const res = await fetch('/leetcode-stats.json')
        if (!res.ok) throw new Error('LeetCode stats file not found')
        const data = await res.json()
        const map = {}
        let yearTotal = 0
        Object.entries(data.calendar || {}).forEach(([ts, count]) => {
          const date = new Date(parseInt(ts, 10) * 1000)
          if (date.getUTCFullYear() === year) {
            const key = date.toISOString().slice(0, 10)
            map[key] = count
            yearTotal += count
          }
        })
        if (cancelled) return
        setGrid(buildYearGrid(map, year, [1, 2, 4]))
        setTotal(yearTotal)
        setStatCards({
          streak: data.streak ?? computeClientStreak(map),
          middle: { label: 'global rank (all-time)', value: data.ranking ? `#${data.ranking.toLocaleString()}` : '—' },
          third: { label: 'questions solved (all-time)', value: data.total ?? 0 },
        })
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [], weekCount: 52 })
          setTotal(0)
          setStatCards(null)
          setError('leetcode')
        }
      }
    }

    if (platform === 'github') loadGithub().finally(() => !cancelled && setLoading(false))
    else loadLeetcode().finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [platform, year])

  return (
    <section id="contributions" className="section section-dark">
      <div className="container">
        <div className="contrib-head">
          <IconBadge>
            <CodeIcon />
          </IconBadge>

          <h2 className="contrib-title">
            <MagneticText>
              Contribution Graph
            </MagneticText>

          </h2>

        </div>

               <div className="contrib-toggle-row">
          <button
            className={`contrib-toggle-btn ${platform === 'github' ? 'active' : ''}`}
            onClick={() => setPlatform('github')}
          >
            <GithubLogoIcon /> GitHub
          </button>
          <button
            className={`contrib-toggle-btn ${platform === 'leetcode' ? 'active' : ''}`}
            onClick={() => setPlatform('leetcode')}
          >
            <LeetCodeLogoIcon /> LeetCode
          </button>
        </div>

              <div className="contrib-grid-wrap">
          <div className="contrib-card">
            {error ? (
              <div className="contrib-error-state">
                <span className="contrib-error-icon">⚠</span>
                <p className="contrib-error-title">
                  Couldn't load {error === 'github' ? 'GitHub' : 'LeetCode'} activity
                </p>
                <p className="contrib-error-sub">
                  {error === 'github'
                    ? 'The GitHub activity service might be temporarily down. Please try again in a moment.'
                    : "LeetCode stats haven't synced yet — they update automatically once a day."}
                </p>
                <button
                  className="contrib-retry-btn"
                  onClick={() => setPlatform((p) => p)}
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="contrib-skeleton">
                <div className="skeleton-months">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="skeleton-shimmer skeleton-month-label" />
                  ))}
                </div>
                <div className="skeleton-grid">
                  {Array.from({ length: 53 }).map((_, wi) => (
                    <div className="skeleton-week-col" key={wi}>
                      {Array.from({ length: 7 }).map((_, di) => (
                        <span key={di} className="skeleton-shimmer skeleton-cell" />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="skeleton-footer">
                  <span className="skeleton-shimmer skeleton-text-sm" />
                  <span className="skeleton-shimmer skeleton-text-xs" />
                </div>
              </div>
            ) : (

              <>
                {isMobile ? (
                  <div className="contrib-vertical">
                    {grid.weeks.map((week, wi) => {
                      const monthLabel = grid.monthLabels.find((m) => m.index === wi)
                      return (
                        <div key={wi} className="contrib-vertical-week">
                          {monthLabel && <span className="contrib-vertical-month">{monthLabel.label}</span>}
                          <div className="contrib-vertical-row">
                            {week.map((day, di) =>
                              day ? (
                                <span
                                  key={di}
                                  className={`contrib-cell level-${day.level}`}
                                  title={`${day.count} on ${day.date}`}
                                />
                              ) : (
                                <span key={di} className="contrib-cell contrib-cell-empty" />
                              )
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <>
                    <div className="contrib-months" style={{ gridTemplateColumns: `repeat(${grid.weekCount}, 1fr)` }}>
                      {grid.monthLabels.map((m) => (
                        <span key={m.index} style={{ gridColumnStart: m.index + 1 }}>
                          {m.label}
                        </span>
                      ))}
                    </div>
                    <div className="contrib-weeks" style={{ gridTemplateColumns: `repeat(${grid.weekCount}, 1fr)` }}>
                      {grid.weeks.map((week, wi) => (
                        <div className="contrib-week-col" key={wi}>
                          {week.map((day, di) =>
                            day ? (
                              <span
                                key={di}
                                className={`contrib-cell level-${day.level}`}
                                title={`${day.count} on ${day.date}`}
                              />
                            ) : (
                              <span key={di} className="contrib-cell contrib-cell-empty" />
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="contrib-footer">
                  <span>{total} {platform === 'github' ? 'contributions' : 'submissions'} in {year}</span>
                  <span className="contrib-legend">
                    Less
                    <span className="contrib-cell level-0" />
                    <span className="contrib-cell level-1" />
                    <span className="contrib-cell level-2" />
                    <span className="contrib-cell level-3" />
                    <span className="contrib-cell level-4" />
                    More
                  </span>
                </div>
              </>

            )}
          </div>

          <div className="contrib-year-list">
            {years.map((y) => (
              <button
                key={y}
                className={`contrib-year-btn ${year === y ? 'active' : ''}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

               {loading && (
          <div className="contrib-stats-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="contrib-stat-card" key={i}>
                <span className="skeleton-shimmer skeleton-icon-circle" />
                <div style={{ flex: 1 }}>
                  <span className="skeleton-shimmer skeleton-text-lg" />
                  <span className="skeleton-shimmer skeleton-text-xs" style={{ marginTop: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && statCards && (
          <div className="contrib-stats-grid">
            <div className="contrib-stat-card">
              <span className="contrib-stat-icon">🔥</span>
              <div>
                <span className="contrib-stat-value">{statCards.streak}</span>
                <span className="contrib-stat-label">day streak (current)</span>
              </div>
            </div>
            <div className="contrib-stat-card">
              <span className="contrib-stat-icon">🏅</span>
              <div>
                <span className="contrib-stat-value">{statCards.middle.value}</span>
                <span className="contrib-stat-label">{statCards.middle.label}</span>
              </div>
            </div>
            <div className="contrib-stat-card">
              <span className="contrib-stat-icon">✓</span>
              <div>
                <span className="contrib-stat-value">{statCards.third.value}</span>
                <span className="contrib-stat-label">{statCards.third.label}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
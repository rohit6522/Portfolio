import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import IconBadge, { CodeIcon } from './IconBadge'
import MagneticText from './MagneticText'


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
  const isMobile = useIsMobile()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function loadGithub() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${profile.githubUsername}?y=${year}`
        )
        const data = await res.json()
        const map = {}
          ; (data.contributions || []).forEach((c) => {
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
      } catch {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [], weekCount: 52 })
          setTotal(0)
          setStatCards(null)
        }
      }
    }

    async function loadLeetcode() {
      try {
        const res = await fetch('/leetcode-stats.json')
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
        setStatCards({
          streak: data.streak ?? computeClientStreak(map),
          middle: { label: 'global rank (all-time)', value: data.ranking ? `#${data.ranking.toLocaleString()}` : '—' },
          third: { label: 'questions solved (all-time)', value: data.total ?? 0 },
        })
      } catch {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [], weekCount: 52 })
          setTotal(0)
          setStatCards(null)
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
            GitHub
          </button>
          <button
            className={`contrib-toggle-btn ${platform === 'leetcode' ? 'active' : ''}`}
            onClick={() => setPlatform('leetcode')}
          >
            LeetCode
          </button>
        </div>

        <div className="contrib-grid-wrap">
          <div className="contrib-card">
            {loading ? (
              <div className="contrib-loading">Loading {platform} activity…</div>
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
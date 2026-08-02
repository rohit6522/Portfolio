import { useEffect, useState } from 'react'
import { profile } from '../data/content'

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

  return { weeks, monthLabels }
}

export default function ContributionGraph() {
  const [platform, setPlatform] = useState('github')
  const [year, setYear] = useState(currentYear)
  const [loading, setLoading] = useState(true)
  const [grid, setGrid] = useState({ weeks: [], monthLabels: [] })
  const [total, setTotal] = useState(0)

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
        ;(data.contributions || []).forEach((c) => {
          map[c.date] = c.count
        })
        if (cancelled) return
        setGrid(buildYearGrid(map, year, [3, 6, 10]))
        setTotal(data.total?.[year] ?? Object.values(map).reduce((a, b) => a + b, 0))
      } catch {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [] })
          setTotal(0)
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
        setTotal(yearTotal)
      } catch {
        if (!cancelled) {
          setGrid({ weeks: [], monthLabels: [] })
          setTotal(0)
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
          <span className="contrib-icon">📅</span>
          <h2 className="contrib-title">Contribution Graph</h2>
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
                <div className="contrib-scroll">
                  <div className="contrib-months">
                    {grid.monthLabels.map((m) => (
                      <span key={m.index} style={{ gridColumnStart: m.index + 1 }}>
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <div className="contrib-weeks">
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
                </div>

                <div className="contrib-footer">
                  <span>{total} contributions in {year}</span>
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
      </div>
    </section>
  )
}
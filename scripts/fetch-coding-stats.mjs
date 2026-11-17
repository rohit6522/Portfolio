import { readFileSync, writeFileSync, existsSync } from 'fs'

const LEETCODE_USER = 'rohit6522'
const GFG_USER = 'rohitrajy62'
const HACKERRANK_USER = 'rohitrajyadav651'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
}

function readJsonSafe(path) {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, 'utf-8'))
    }
  } catch {
    // ignore corrupted previous file
  }
  return null
}

function computeStreak(calendar) {
  const daySeconds = 86400
  const today = Math.floor(Date.now() / 1000 / daySeconds) * daySeconds
  let streak = 0
  let cursor = today

  if (!calendar[String(cursor)]) {
    cursor -= daySeconds
  }

  while (calendar[String(cursor)] && calendar[String(cursor)] > 0) {
    streak++
    cursor -= daySeconds
  }

  return streak
}

async function fetchLeetCode(prevLeetCode) {
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
      }
    }
  `

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        ...BROWSER_HEADERS,
        'Content-Type': 'application/json',
        Referer: `https://leetcode.com/${LEETCODE_USER}/`,
        Origin: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const user = json?.data?.matchedUser
    if (!user) throw new Error('User not found in LeetCode response')

    const stats = user.submitStatsGlobal?.acSubmissionNum || []
    const calendar = user.submissionCalendar ? JSON.parse(user.submissionCalendar) : {}
    const ranking = user.profile?.ranking ?? null

    const total = stats.find((s) => s.difficulty === 'All')?.count ?? 0
    const easy = stats.find((s) => s.difficulty === 'Easy')?.count ?? 0
    const medium = stats.find((s) => s.difficulty === 'Medium')?.count ?? 0
    const hard = stats.find((s) => s.difficulty === 'Hard')?.count ?? 0
    const streak = computeStreak(calendar)

    return {
      ok: true,
      full: {
        username: LEETCODE_USER,
        total,
        easy,
        medium,
        hard,
        ranking,
        streak,
        calendar,
        updatedAt: new Date().toISOString(),
      },
      summary: {
        username: LEETCODE_USER,
        total,
        easy,
        medium,
        hard,
        ranking,
        streak,
      },
    }
  } catch (err) {
    console.warn('LeetCode fetch failed, keeping previous data:', err.message)
    return {
      ok: false,
      full: prevLeetCode,
      summary: prevLeetCode
        ? {
            username: prevLeetCode.username || LEETCODE_USER,
            total: prevLeetCode.total ?? 0,
            easy: prevLeetCode.easy ?? 0,
            medium: prevLeetCode.medium ?? 0,
            hard: prevLeetCode.hard ?? 0,
            ranking: prevLeetCode.ranking ?? null,
            streak: prevLeetCode.streak ?? 0,
          }
        : null,
    }
  }
}

async function fetchGfg(prevGfg) {
  // Primary: official GFG user-profile-info API
  try {
    const res = await fetch(
      `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${encodeURIComponent(GFG_USER)}`,
      { headers: { ...BROWSER_HEADERS, Accept: 'application/json' } }
    )
    if (res.ok) {
      const json = await res.json()
      const data = json?.data
      if (data && typeof data.total_problems_solved === 'number') {
        return {
          ok: true,
          summary: {
            username: GFG_USER,
            total: data.total_problems_solved,
            score: data.score ?? null,
            instituteRank: data.institute_rank ?? null,
          },
        }
      }
    }
  } catch (err) {
    console.warn('GFG authapi failed, trying profile page fallback:', err.message)
  }

  // Fallback: scrape embedded JSON from public profile page
  try {
    const res = await fetch(`https://www.geeksforgeeks.org/profile/${encodeURIComponent(GFG_USER)}`, {
      headers: { ...BROWSER_HEADERS, Accept: 'text/html' },
    })
    if (res.ok) {
      const html = await res.text()
      const match = html.match(/total_problems_solved\\?"\s*:\s*(\d+)/)
      if (match) {
        return {
          ok: true,
          summary: {
            username: GFG_USER,
            total: parseInt(match[1], 10),
            score: prevGfg?.score ?? null,
            instituteRank: prevGfg?.instituteRank ?? null,
          },
        }
      }
    }
  } catch (err) {
    console.warn('GFG profile page fallback failed:', err.message)
  }

  console.warn('GFG fetch failed, keeping previous data')
  return { ok: false, summary: prevGfg }
}

function normalizeBadgeName(name, type) {
  const lower = (type || name || '').toLowerCase()
  if (lower === 'sql') return 'SQL'
  if (lower === 'cpp') return 'C++'
  if (lower === 'c') return 'C'
  if (lower === 'java') return 'Java'
  if (lower === 'python') return 'Python'
  if (lower === 'problem-solving' || lower === 'algorithms') return 'DSA'
  if (lower === 'javascript' || lower === '10-days-of-javascript') return 'JS'
  return name
}

function normalizeBadgeIcon(type, name) {
  const lower = (type || name || '').toLowerCase()
  if (lower.includes('python')) return 'python'
  if (lower === 'java') return 'java'
  if (lower.includes('sql')) return 'sql'
  if (lower === 'cpp' || lower === 'c++') return 'cpp'
  if (lower === 'c') return 'c'
  if (lower.includes('javascript') || lower === 'js') return 'javascript'
  if (lower.includes('problem') || lower.includes('algorithm')) return 'dsa'
  return 'code'
}

async function fetchHackerRank(prevHackerRank) {
  try {
    const res = await fetch(
      `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(HACKERRANK_USER)}/badges`,
      { headers: { ...BROWSER_HEADERS, Accept: 'application/json' } }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const models = Array.isArray(json?.models) ? json.models : []

    const badges = models
      .filter((m) => (m.stars ?? 0) > 0)
      .map((m) => ({
        name: normalizeBadgeName(m.badge_name, m.badge_type),
        icon: normalizeBadgeIcon(m.badge_type, m.badge_name),
        stars: m.stars,
        solved: m.solved ?? 0,
        points: m.current_points ?? 0,
      }))
      .sort((a, b) => b.stars - a.stars || b.points - a.points)

    return {
      ok: true,
      summary: {
        username: HACKERRANK_USER,
        badges,
      },
    }
  } catch (err) {
    console.warn('HackerRank fetch failed, keeping previous data:', err.message)
    return { ok: false, summary: prevHackerRank }
  }
}

async function main() {
  const prevLeetCode = readJsonSafe('public/leetcode-stats.json')
  const prevCoding = readJsonSafe('public/coding-stats.json')

  const [lcResult, gfgResult, hrResult] = await Promise.all([
    fetchLeetCode(prevLeetCode),
    fetchGfg(prevCoding?.gfg || null),
    fetchHackerRank(prevCoding?.hackerrank || null),
  ])

  if (lcResult.ok && lcResult.full) {
    writeFileSync('public/leetcode-stats.json', JSON.stringify(lcResult.full, null, 2))
    console.log(
      `LeetCode: ${lcResult.summary.total} solved (E:${lcResult.summary.easy} M:${lcResult.summary.medium} H:${lcResult.summary.hard}), streak: ${lcResult.summary.streak}`
    )
  }

  const leetcode = lcResult.summary || prevCoding?.leetcode || { username: LEETCODE_USER, total: 0 }
  const gfg = gfgResult.summary || prevCoding?.gfg || { username: GFG_USER, total: 0 }
  const hackerrank = hrResult.summary || prevCoding?.hackerrank || { username: HACKERRANK_USER, badges: [] }

  const codingStats = {
    leetcode,
    gfg,
    combinedTotal: (leetcode.total || 0) + (gfg.total || 0),
    hackerrank,
    updatedAt: new Date().toISOString(),
  }

  writeFileSync('public/coding-stats.json', JSON.stringify(codingStats, null, 2))
  console.log(`GFG: ${gfg.total} solved (score: ${gfg.score ?? 'N/A'})`)
  console.log(`Combined Total: ${codingStats.combinedTotal}`)
  console.log(
    'HackerRank Badges:',
    hackerrank.badges.map((b) => `${b.name} (${b.stars}★)`).join(', ')
  )

  if (!lcResult.ok && !gfgResult.ok && !hrResult.ok) {
    console.error('All coding platform fetches failed.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unexpected error fetching coding stats:', err)
  process.exit(1)
})

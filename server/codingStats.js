import express from 'express'

const router = express.Router()

const LEETCODE_USER = process.env.LEETCODE_USER || 'rohit6522'
const GFG_USER = process.env.GFG_USER || 'rohitrajy62'
const HACKERRANK_USER = process.env.HACKERRANK_USER || 'rohitrajyadav651'

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes
let cachedStats = null
let cachedAt = 0

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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

async function fetchLeetCode() {
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        profile { ranking }
        submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
      }
    }
  `
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      ...BROWSER_HEADERS,
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/${LEETCODE_USER}/`,
      Origin: 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status}`)
  const json = await res.json()
  const user = json?.data?.matchedUser
  if (!user) throw new Error('LeetCode user not found')
  const stats = user.submitStatsGlobal?.acSubmissionNum || []
  return {
    username: LEETCODE_USER,
    total: stats.find((s) => s.difficulty === 'All')?.count ?? 0,
    easy: stats.find((s) => s.difficulty === 'Easy')?.count ?? 0,
    medium: stats.find((s) => s.difficulty === 'Medium')?.count ?? 0,
    hard: stats.find((s) => s.difficulty === 'Hard')?.count ?? 0,
    ranking: user.profile?.ranking ?? null,
  }
}

async function fetchGfg() {
  const res = await fetch(
    `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${encodeURIComponent(GFG_USER)}`,
    {
      headers: { ...BROWSER_HEADERS, Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    }
  )
  if (!res.ok) throw new Error(`GFG HTTP ${res.status}`)
  const json = await res.json()
  const data = json?.data
  if (!data || typeof data.total_problems_solved !== 'number') {
    throw new Error('GFG total_problems_solved missing')
  }
  return {
    username: GFG_USER,
    total: data.total_problems_solved,
    score: data.score ?? null,
    instituteRank: data.institute_rank ?? null,
  }
}

async function fetchHackerRank() {
  const res = await fetch(
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(HACKERRANK_USER)}/badges`,
    {
      headers: { ...BROWSER_HEADERS, Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    }
  )
  if (!res.ok) throw new Error(`HackerRank HTTP ${res.status}`)
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
    username: HACKERRANK_USER,
    badges,
  }
}

router.get('/', async (req, res) => {
  const now = Date.now()
  if (cachedStats && now - cachedAt < CACHE_TTL_MS) {
    return res.json(cachedStats)
  }

  const [lcRes, gfgRes, hrRes] = await Promise.allSettled([
    fetchLeetCode(),
    fetchGfg(),
    fetchHackerRank(),
  ])

  const leetcode = lcRes.status === 'fulfilled' ? lcRes.value : cachedStats?.leetcode || null
  const gfg = gfgRes.status === 'fulfilled' ? gfgRes.value : cachedStats?.gfg || null
  const hackerrank = hrRes.status === 'fulfilled' ? hrRes.value : cachedStats?.hackerrank || null

  if (!leetcode && !gfg && !hackerrank) {
    return res.status(503).json({ error: 'Unable to fetch coding stats right now.' })
  }

  const combinedTotal =
    leetcode && gfg ? (leetcode.total || 0) + (gfg.total || 0) : null

  const payload = {
    leetcode,
    gfg,
    combinedTotal,
    hackerrank,
    updatedAt: new Date().toISOString(),
  }

  cachedStats = payload
  cachedAt = now
  return res.json(payload)
})

export default router

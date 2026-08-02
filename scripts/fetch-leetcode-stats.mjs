import { writeFileSync } from 'fs'

const username = 'rohit6522'

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

async function main() {

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/${username}/`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Origin: 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables: { username } }),
  })

  if (!res.ok) {
    console.error('LeetCode API responded with status:', res.status)
    const text = await res.text()
    console.error('Response body:', text.slice(0, 500))
    process.exit(1)
  }

  const json = await res.json()
  const user = json?.data?.matchedUser
  const stats = user?.submitStatsGlobal?.acSubmissionNum || []
  const calendar = user?.submissionCalendar ? JSON.parse(user.submissionCalendar) : {}
  const ranking = user?.profile?.ranking ?? null

  const total = stats.find((s) => s.difficulty === 'All')?.count ?? 0
  const easy = stats.find((s) => s.difficulty === 'Easy')?.count ?? 0
  const medium = stats.find((s) => s.difficulty === 'Medium')?.count ?? 0
  const hard = stats.find((s) => s.difficulty === 'Hard')?.count ?? 0
  const streak = computeStreak(calendar)

  const output = {
    username,
    total,
    easy,
    medium,
    hard,
    ranking,
    streak,
    calendar,
    updatedAt: new Date().toISOString(),
  }

  writeFileSync('public/leetcode-stats.json', JSON.stringify(output, null, 2))
  console.log('Saved stats with', Object.keys(calendar).length, 'calendar entries, streak:', streak)
}

main().catch((err) => {
  console.error('Failed to fetch LeetCode stats:', err)
  process.exit(1)
})
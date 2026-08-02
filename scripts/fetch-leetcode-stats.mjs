import { writeFileSync } from 'fs'

const username = 'rohit6522'

const query = `
  query userProblemsSolved($username: String!) {
    matchedUser(username: $username) {
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

async function main() {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/${username}/`,
    },
    body: JSON.stringify({ query, variables: { username } }),
  })

  const json = await res.json()
  const user = json?.data?.matchedUser
  const stats = user?.submitStatsGlobal?.acSubmissionNum || []
  const calendar = user?.submissionCalendar ? JSON.parse(user.submissionCalendar) : {}

  const total = stats.find((s) => s.difficulty === 'All')?.count ?? 0
  const easy = stats.find((s) => s.difficulty === 'Easy')?.count ?? 0
  const medium = stats.find((s) => s.difficulty === 'Medium')?.count ?? 0
  const hard = stats.find((s) => s.difficulty === 'Hard')?.count ?? 0

  const output = {
    username,
    total,
    easy,
    medium,
    hard,
    calendar,
    updatedAt: new Date().toISOString(),
  }

  writeFileSync('public/leetcode-stats.json', JSON.stringify(output, null, 2))
  console.log('Saved stats with', Object.keys(calendar).length, 'calendar entries')
}

main().catch((err) => {
  console.error('Failed to fetch LeetCode stats:', err)
  process.exit(1)
})
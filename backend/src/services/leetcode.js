const axios = require('axios');

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

async function fetchLeetCodeStats(username) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await axios.post(
      LEETCODE_API_URL,
      {
        query,
        variables: { username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
      }
    );

    const user = response.data?.data?.matchedUser;
    if (!user) {
      throw new Error(`LeetCode user "${username}" not found`);
    }

    const stats = user.submitStatsGlobal.acSubmissionNum;
    const allSolved = stats.find((s) => s.difficulty === 'All')?.count || 0;
    const easySolved = stats.find((s) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find((s) => s.difficulty === 'Hard')?.count || 0;

    return {
      totalSolved: allSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating: 0,
      globalRanking: user.profile?.ranking || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch stats for ${username}:`, error.message);
    return {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      contestRating: 0,
      globalRanking: 0,
    };
  }
}

module.exports = { fetchLeetCodeStats };

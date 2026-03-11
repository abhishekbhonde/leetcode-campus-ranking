const axios = require('axios');

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

/**
 * Fetch full LeetCode profile stats including school name.
 */
async function fetchLeetCodeStats(username) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            school
            realName
            countryName
            userAvatar
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
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 10000,
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
      school: user.profile?.school || '',
      realName: user.profile?.realName || '',
      avatar: user.profile?.userAvatar || '',
      country: user.profile?.countryName || '',
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
      school: '',
      realName: '',
      avatar: '',
      country: '',
    };
  }
}

/**
 * Try to match a LeetCode school string to a college in the DB.
 * Uses fuzzy name matching (case-insensitive contains).
 */
async function matchSchoolToCollege(prisma, schoolName) {
  if (!schoolName) return null;

  const normalised = schoolName.toLowerCase().trim();

  // Try exact match first
  const exact = await prisma.college.findFirst({
    where: { name: { equals: schoolName, mode: 'insensitive' } },
  });
  if (exact) return exact;

  // Try partial match — check if college name is contained in school string or vice-versa
  const allColleges = await prisma.college.findMany();
  for (const college of allColleges) {
    const collegeLower = college.name.toLowerCase();
    if (normalised.includes(collegeLower) || collegeLower.includes(normalised)) {
      return college;
    }
  }

  return null;
}

module.exports = { fetchLeetCodeStats, matchSchoolToCollege };

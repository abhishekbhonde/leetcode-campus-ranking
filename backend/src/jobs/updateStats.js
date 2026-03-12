const { PrismaClient } = require('@prisma/client');
const { fetchLeetCodeStats } = require('../services/leetcode');

const prisma = new PrismaClient();

async function updateAllStats() {
  console.log('🔄 Starting LeetCode stats update for all users...');

  try {
    const users = await prisma.user.findMany({
      select: { id: true, leetcodeUsername: true },
    });

    console.log(`Found ${users.length} users to update.`);

    for (const user of users) {
      try {
        const stats = await fetchLeetCodeStats(user.leetcodeUsername);
        
        // Filter stats to only include fields in the LeetcodeStats model
        const dbStats = {
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
          contestRating: stats.contestRating,
          globalRanking: stats.globalRanking,
        };

        await prisma.leetcodeStats.upsert({
          where: { userId: user.id },
          update: { ...dbStats, lastUpdated: new Date() },
          create: { userId: user.id, ...dbStats },
        });
        console.log(`✅ Updated stats for ${user.leetcodeUsername}`);

      } catch (err) {
        console.error(`❌ Failed to update ${user.leetcodeUsername}:`, err.message);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('✅ All stats updated successfully.');
  } catch (error) {
    console.error('Stats update job error:', error);
  }
}

module.exports = { updateAllStats };

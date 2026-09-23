const cron = require('node-cron');
const User = require('../models/User');
const { sendBatchMatchNotifications } = require('./whatsappService');

/**
 * Calculate overlap between two night availability arrays
 */
const getNightOverlapScore = (nightsA = [], nightsB = []) => {
  if (nightsA.includes('All 9 Nights') || nightsB.includes('All 9 Nights')) {
    return 40; // Max night score
  }
  const commonNights = nightsA.filter((n) => nightsB.includes(n));
  if (commonNights.length === 0) return 0;
  return Math.min(40, commonNights.length * 10);
};

/**
 * Calculate Garba style compatibility score
 */
const getStyleCompatibilityScore = (styleA, styleB) => {
  if (!styleA || !styleB) return 20;
  if (styleA === 'All Styles' || styleB === 'All Styles') return 50;
  if (styleA === 'Free Style' || styleB === 'Free Style') return 45;
  if (styleA === styleB) return 50; // Exact match
  return 10;
};

/**
 * Calculate overall compatibility score between two users
 */
const calculatePairScore = (userA, userB) => {
  const nightScore = getNightOverlapScore(userA.nightAvailability, userB.nightAvailability);
  if (nightScore === 0) return -1; // Must have at least one common night

  const styleScore = getStyleCompatibilityScore(userA.garbaStyle, userB.garbaStyle);

  let score = nightScore + styleScore;

  // Area / Locality / Town proximity bonus
  if (
    userA.area &&
    userB.area &&
    userA.area.trim().toLowerCase() === userB.area.trim().toLowerCase()
  ) {
    score += 30; // Strong bonus for same neighborhood/town
  }

  // Format bonus (Solo dancers pair best together)
  if (userA.groupSize === 'Solo' && userB.groupSize === 'Solo') {
    score += 15;
  } else if (userA.groupSize === userB.groupSize) {
    score += 10;
  }

  return score;
};

/**
 * Execute Batch Matching Engine
 * @param {Object} [options]
 * @param {string} [options.mode='hybrid'] - 'pairs' (2 users) | 'groups' (3-4 users) | 'hybrid'
 * @returns {Promise<Object>} Matching execution report
 */
const runBatchMatchingEngine = async (options = { mode: 'hybrid' }) => {
  console.log(`💃 [Matching Engine] Starting batch matching algorithm (Mode: ${options.mode || 'hybrid'})...`);

  // Fetch all pending users
  const pendingUsers = await User.find({ matchStatus: 'Pending' }).lean();

  if (pendingUsers.length === 0) {
    return {
      success: true,
      message: 'No pending users found to match.',
      totalProcessed: 0,
      matchedCount: 0,
      circlesCount: 0,
      matchedCircles: [],
    };
  }

  // Group pending users by city
  const cityBuckets = {};
  pendingUsers.forEach((user) => {
    const city = user.city || 'Vadodara';
    if (!cityBuckets[city]) {
      cityBuckets[city] = [];
    }
    cityBuckets[city].push(user);
  });

  const matchedCircles = [];
  const matchedUserDocs = [];
  let totalMatched = 0;

  // Process each city group
  for (const [city, usersInCity] of Object.entries(cityBuckets)) {
    const pool = [...usersInCity];
    const processedIds = new Set();

    for (let i = 0; i < pool.length; i++) {
      const userA = pool[i];
      if (processedIds.has(userA._id.toString())) continue;

      // Find compatible candidate matches sorted by score
      const candidates = [];

      for (let j = i + 1; j < pool.length; j++) {
        const userB = pool[j];
        if (processedIds.has(userB._id.toString())) continue;

        const score = calculatePairScore(userA, userB);
        if (score > 0) {
          candidates.push({ user: userB, score });
        }
      }

      candidates.sort((a, b) => b.score - a.score);

      if (candidates.length > 0) {
        // Form a Pair (2 users) or Micro-group (3-4 users based on preference or mode)
        const wantsGroup =
          options.mode === 'groups' ||
          (options.mode === 'hybrid' &&
            userA.groupSize === 'Group (3+)' &&
            candidates.length >= 2);

        let circleMembers = [userA];

        if (wantsGroup && candidates.length >= 2) {
          // Add top 2-3 candidates to form a micro-group of 3-4 dancers
          const groupCount = Math.min(3, candidates.length);
          for (let k = 0; k < groupCount; k++) {
            circleMembers.push(candidates[k].user);
          }
        } else {
          // Standard Pair
          circleMembers.push(candidates[0].user);
        }

        // Mark all circle members as processed
        circleMembers.forEach((member) => processedIds.add(member._id.toString()));

        // Update each member in Database with cross references
        for (const member of circleMembers) {
          const otherMemberIds = circleMembers
            .filter((m) => m._id.toString() !== member._id.toString())
            .map((m) => m._id);

          const updatedDoc = await User.findByIdAndUpdate(
            member._id,
            {
              $set: { matchStatus: 'Matched' },
              $addToSet: { matchedWith: { $each: otherMemberIds } },
            },
            { new: true }
          );

          if (updatedDoc) {
            matchedUserDocs.push(updatedDoc);
          }
        }

        totalMatched += circleMembers.length;

        matchedCircles.push({
          city,
          type: circleMembers.length > 2 ? `Micro-Group (${circleMembers.length} dancers)` : 'Pair',
          members: circleMembers.map((m) => ({
            id: m._id,
            name: m.fullName,
            phone: m.phone,
            style: m.garbaStyle,
            area: m.area,
          })),
        });
      }
    }
  }

  // Dispatch WhatsApp notifications automatically for newly matched users
  let notificationSummary = [];
  if (matchedUserDocs.length > 0) {
    console.log(`📣 [Matching Engine] Dispathing WhatsApp match notifications for ${matchedUserDocs.length} users...`);
    notificationSummary = await sendBatchMatchNotifications(matchedUserDocs);
  }

  return {
    success: true,
    message: `Batch matching complete! Matched ${totalMatched} dancers into ${matchedCircles.length} Garba circles.`,
    totalProcessed: pendingUsers.length,
    matchedCount: totalMatched,
    unmatchedRemaining: pendingUsers.length - totalMatched,
    circlesCount: matchedCircles.length,
    matchedCircles,
    notificationsDispatched: notificationSummary.length,
  };
};

/**
 * Initialize Node-Cron matching schedule leading up to Navratri
 */
const initMatchingSchedule = () => {
  // Run daily at 02:00 AM IST in early October (Oct 1 to Oct 10)
  cron.schedule('0 2 1-10 10 *', async () => {
    console.log('⏰ [Cron Trigger] Executing automated pre-Navratri batch matching job...');
    try {
      await runBatchMatchingEngine({ mode: 'hybrid' });
    } catch (err) {
      console.error('❌ [Cron Error] Batch matching failed:', err.message);
    }
  });

  console.log('🕒 [Cron Scheduler] Pre-Navratri batch matching cron initialized.');
};

module.exports = {
  calculatePairScore,
  getNightOverlapScore,
  getStyleCompatibilityScore,
  runBatchMatchingEngine,
  initMatchingSchedule,
};

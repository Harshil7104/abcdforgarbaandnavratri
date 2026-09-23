const User = require('../models/User');
const NotificationLog = require('../models/NotificationLog');
const { runBatchMatchingEngine } = require('../services/matchingEngine');
const { sendMatchNotification } = require('../services/whatsappService');

/**
 * @desc    Execute batch matching engine
 * @route   POST /api/admin/match
 */
const executeBatchMatching = async (req, res, next) => {
  try {
    const { mode } = req.body;
    const result = await runBatchMatchingEngine({ mode: mode || 'hybrid' });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get matching engine statistics
 * @route   GET /api/admin/stats
 */
const getMatchingStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const matchedCount = await User.countDocuments({ matchStatus: 'Matched' });
    const pendingCount = await User.countDocuments({ matchStatus: 'Pending' });
    const blockedCount = await User.countDocuments({ matchStatus: 'Blocked' });

    // Grouping by city
    const cityBreakdown = await User.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Grouping by style
    const styleBreakdown = await User.aggregate([
      { $group: { _id: '$garbaStyle', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalNotifications = await NotificationLog.countDocuments();
    const reportedUsersCount = await User.countDocuments({ 'reports.0': { $exists: true } });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        matchedCount,
        pendingCount,
        blockedCount,
        reportedUsersCount,
        cityBreakdown,
        styleBreakdown,
        totalNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all registered users with filter & search capabilities
 * @route   GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { city, matchStatus, gender, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (city && city !== 'All') query.city = city;
    if (matchStatus && matchStatus !== 'All') query.matchStatus = matchStatus;
    if (gender && gender !== 'All') query.gender = gender;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { phone: searchRegex },
        { area: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select('-password')
      .populate('matchedWith', 'fullName phone city garbaStyle')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(query);

    // Format with flagCount
    const formattedUsers = users.map((u) => ({
      ...u,
      flagCount: u.reports ? u.reports.length : 0,
    }));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      data: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Block a user (moderation action)
 * @route   POST /api/admin/block
 */
const blockUser = async (req, res, next) => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Unlink from existing matches
    if (user.matchedWith && user.matchedWith.length > 0) {
      await User.updateMany(
        { _id: { $in: user.matchedWith } },
        {
          $pull: { matchedWith: user._id },
        }
      );
    }

    user.matchStatus = 'Blocked';
    user.isBlocked = true;
    user.matchedWith = [];
    await user.save();

    console.log(`🚫 [Admin Moderation] User ${user.fullName} (${user.phone}) was BLOCKED. Reason: ${reason || 'Admin action'}`);

    return res.status(200).json({
      success: true,
      message: `User ${user.fullName} has been blocked and removed from active match circles.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unblock a user
 * @route   POST /api/admin/unblock
 */
const unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { matchStatus: 'Pending', isBlocked: false } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.fullName} has been unblocked and set to Pending status.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user reports and safety flags
 * @route   GET /api/admin/reports
 */
const getAdminReports = async (req, res, next) => {
  try {
    const reportedUsers = await User.find({ 'reports.0': { $exists: true } })
      .select('fullName phone city garbaStyle matchStatus reports isBlocked')
      .populate('reports.reportedBy', 'fullName phone city')
      .sort({ 'reports.createdAt': -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: reportedUsers.length,
      data: reportedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get notification dispatch logs
 * @route   GET /api/admin/notifications
 */
const getNotificationLogs = async (req, res, next) => {
  try {
    const logs = await NotificationLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Trigger a test WhatsApp notification
 * @route   POST /api/admin/test-notification
 */
const triggerTestNotification = async (req, res, next) => {
  try {
    const { phone, fullName, city } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone is required' });
    }

    const mockUser = {
      _id: new (require('mongoose').Types.ObjectId)(),
      phone,
      fullName: fullName || 'Test Garba Lover',
      city: city || 'Vadodara',
    };

    const result = await sendMatchNotification(mockUser, 2);
    return res.status(200).json({
      success: true,
      message: 'Test notification triggered.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed mock authentic Gujarati users for instant demo testing
 * @route   POST /api/admin/seed-demo
 */
const seedDemoPartners = async (req, res, next) => {
  try {
    const sampleProfiles = [
      {
        fullName: 'Kavya Shah',
        phone: '9825012345',
        password: 'password123',
        gender: 'Female',
        city: 'Vadodara',
        area: 'Vasna Road',
        garbaStyle: 'Dodhiya',
        groupSize: 'Solo',
        nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
        socialProfile: '@kavya_garba_vdr',
      },
      {
        fullName: 'Rohan Mehta',
        phone: '9825123456',
        password: 'password123',
        gender: 'Male',
        city: 'Vadodara',
        area: 'Vasna Road',
        garbaStyle: 'Dodhiya',
        groupSize: 'Solo',
        nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3', 'Night 6', 'Night 7'],
        socialProfile: '@rohan_mehta_garba',
      },
      {
        fullName: 'Ananya Joshi',
        phone: '9825234567',
        password: 'password123',
        gender: 'Female',
        city: 'Ahmedabad',
        area: 'SG Highway',
        garbaStyle: 'Popat',
        groupSize: 'Duo',
        nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 8', 'Night 9'],
        socialProfile: '@ananya_j_garba',
      },
      {
        fullName: 'Jayesh Patel',
        phone: '9825345678',
        password: 'password123',
        gender: 'Male',
        city: 'Ahmedabad',
        area: 'SG Highway',
        garbaStyle: 'Popat',
        groupSize: 'Solo',
        nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4'],
        socialProfile: '@jayesh_navratri_amd',
      },
      {
        fullName: 'Pooja Desai',
        phone: '9825456789',
        password: 'password123',
        gender: 'Female',
        city: 'Surat',
        area: 'Adajan',
        garbaStyle: 'Tran Tali',
        groupSize: 'Solo',
        nightAvailability: ['All 9 Nights'],
        socialProfile: '@pooja_surat_garba',
      },
    ];

    let createdCount = 0;
    for (const profile of sampleProfiles) {
      const exists = await User.findOne({ phone: profile.phone });
      if (!exists) {
        await User.create(profile);
        createdCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Demo seed complete. Created ${createdCount} sample Garba enthusiasts with matching areas & styles.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset all users to pending for testing
 * @route   POST /api/admin/reset-matching
 */
const resetMatching = async (req, res, next) => {
  try {
    await User.updateMany(
      {},
      {
        $set: { matchStatus: 'Pending', matchedWith: [], isBlocked: false },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All users reset to Pending match status.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed match pairs & groups overview for admin monitoring
 * @route   GET /api/admin/matches-overview
 */
const getMatchesOverview = async (req, res, next) => {
  try {
    const { city, gender, status, search } = req.query;

    const query = {};
    if (city && city !== 'All') query.city = city;
    if (gender && gender !== 'All') query.gender = gender;
    if (status && status !== 'All') query.matchStatus = status;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { phone: regex }, { area: regex }, { socialProfile: regex }];
    }

    const allUsers = await User.find(query)
      .populate('matchedWith', 'fullName phone gender city area garbaStyle nightAvailability socialProfile matchStatus groupSize')
      .lean();

    // Group users into unique match pairs/clusters to avoid displaying duplicate mirror rows
    const seenPairs = new Set();
    const matchesList = [];

    for (const user of allUsers) {
      if (user.matchStatus === 'Matched' && user.matchedWith && user.matchedWith.length > 0) {
        for (const partner of user.matchedWith) {
          const pairKey = [user._id.toString(), partner._id.toString()].sort().join('_');
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);

            // Compute common nights & compatibility
            const userNights = new Set(user.nightAvailability || []);
            const partnerNights = new Set(partner.nightAvailability || []);
            const commonNights = (user.nightAvailability || []).filter((n) => partnerNights.has(n));
            const hasAll9 = userNights.has('All 9 Nights') || partnerNights.has('All 9 Nights');

            const isSameCity = user.city === partner.city;
            const isSameStyle = user.garbaStyle === partner.garbaStyle;
            const styleOverlap = isSameStyle ? user.garbaStyle : `${user.garbaStyle} & ${partner.garbaStyle}`;

            // Calculate match score
            let score = 50;
            if (isSameCity) score += 20;
            if (isSameStyle) score += 20;
            if (commonNights.length > 0 || hasAll9) score += 10;

            matchesList.push({
              matchId: pairKey,
              type: 'Pair',
              status: 'Matched',
              city: user.city,
              area: user.area || partner.area || 'City Area',
              userA: {
                _id: user._id,
                fullName: user.fullName,
                phone: user.phone,
                gender: user.gender,
                city: user.city,
                area: user.area,
                garbaStyle: user.garbaStyle,
                groupSize: user.groupSize,
                nightAvailability: user.nightAvailability,
                socialProfile: user.socialProfile,
                createdAt: user.createdAt,
              },
              userB: {
                _id: partner._id,
                fullName: partner.fullName,
                phone: partner.phone,
                gender: partner.gender,
                city: partner.city,
                area: partner.area,
                garbaStyle: partner.garbaStyle,
                groupSize: partner.groupSize,
                nightAvailability: partner.nightAvailability,
                socialProfile: partner.socialProfile,
                createdAt: partner.createdAt,
              },
              overlappingStyle: styleOverlap,
              commonNights: hasAll9 ? ['All 9 Nights (Shared)'] : (commonNights.length ? commonNights : ['General Availability']),
              matchScore: `${score}%`,
              matchedAt: user.updatedAt || user.createdAt,
            });
          }
        }
      } else if (user.matchStatus === 'Pending' && (status === 'All' || status === 'Pending')) {
        matchesList.push({
          matchId: `pending_${user._id}`,
          type: 'Pending Solo',
          status: 'Pending',
          city: user.city,
          area: user.area || 'City Area',
          userA: {
            _id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            gender: user.gender,
            city: user.city,
            area: user.area,
            garbaStyle: user.garbaStyle,
            groupSize: user.groupSize,
            nightAvailability: user.nightAvailability,
            socialProfile: user.socialProfile,
            createdAt: user.createdAt,
          },
          userB: null,
          overlappingStyle: user.garbaStyle,
          commonNights: user.nightAvailability || [],
          matchScore: 'N/A (Awaiting Match)',
          matchedAt: user.createdAt,
        });
      }
    }

    return res.status(200).json({
      success: true,
      total: matchesList.length,
      data: matchesList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Break an existing match (Manual Override)
 * @route   POST /api/admin/manual-unmatch
 */
const manualUnmatch = async (req, res, next) => {
  try {
    const { userAId, userBId } = req.body;

    if (!userAId) {
      return res.status(400).json({ success: false, message: 'User A ID is required.' });
    }

    const userA = await User.findById(userAId);
    if (!userA) {
      return res.status(404).json({ success: false, message: 'User A not found.' });
    }

    if (userBId) {
      // Unlink both users
      await User.findByIdAndUpdate(userAId, {
        $pull: { matchedWith: userBId },
        $set: { matchStatus: 'Pending' },
      });
      await User.findByIdAndUpdate(userBId, {
        $pull: { matchedWith: userAId },
        $set: { matchStatus: 'Pending' },
      });
    } else {
      // Unlink all current partners
      if (userA.matchedWith && userA.matchedWith.length > 0) {
        await User.updateMany(
          { _id: { $in: userA.matchedWith } },
          {
            $pull: { matchedWith: userA._id },
            $set: { matchStatus: 'Pending' },
          }
        );
      }
      userA.matchedWith = [];
      userA.matchStatus = 'Pending';
      await userA.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Match successfully broken. Users reset to Pending status.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Manually pair two specific pending users
 * @route   POST /api/admin/manual-match
 */
const manualMatch = async (req, res, next) => {
  try {
    const { userAId, userBId } = req.body;

    if (!userAId || !userBId || userAId === userBId) {
      return res.status(400).json({ success: false, message: 'Two distinct user IDs are required.' });
    }

    const userA = await User.findById(userAId);
    const userB = await User.findById(userBId);

    if (!userA || !userB) {
      return res.status(404).json({ success: false, message: 'One or both users not found.' });
    }

    // Set match references
    userA.matchedWith = [userB._id];
    userA.matchStatus = 'Matched';
    await userA.save();

    userB.matchedWith = [userA._id];
    userB.matchStatus = 'Matched';
    await userB.save();

    console.log(`🤝 [Admin Manual Match] Paired ${userA.fullName} (+91 ${userA.phone}) with ${userB.fullName} (+91 ${userB.phone})`);

    return res.status(200).json({
      success: true,
      message: `Successfully paired ${userA.fullName} with ${userB.fullName}!`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export all matched pairs & details to CSV
 * @route   GET /api/admin/export-matches
 */
const exportMatchesCsv = async (req, res, next) => {
  try {
    const matchedUsers = await User.find({ matchStatus: 'Matched' })
      .populate('matchedWith', 'fullName phone city area garbaStyle socialProfile nightAvailability')
      .lean();

    const seenPairs = new Set();
    const rows = [
      ['Match ID', 'City', 'User A Name', 'User A Phone', 'User A Style', 'User A Area', 'User A Instagram', 'User B Name', 'User B Phone', 'User B Style', 'User B Area', 'User B Instagram', 'Shared Nights', 'Matched Date'],
    ];

    for (const u of matchedUsers) {
      if (u.matchedWith && u.matchedWith.length > 0) {
        for (const partner of u.matchedWith) {
          const pairKey = [u._id.toString(), partner._id.toString()].sort().join('_');
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);

            const userNights = new Set(u.nightAvailability || []);
            const partnerNights = new Set(partner.nightAvailability || []);
            const commonNights = (u.nightAvailability || []).filter((n) => partnerNights.has(n));
            const sharedNightsStr = userNights.has('All 9 Nights') || partnerNights.has('All 9 Nights')
              ? 'All 9 Nights'
              : (commonNights.join('; ') || 'General');

            rows.push([
              pairKey,
              `"${u.city || ''}"`,
              `"${u.fullName || ''}"`,
              `"+91 ${u.phone || ''}"`,
              `"${u.garbaStyle || ''}"`,
              `"${u.area || ''}"`,
              `"${u.socialProfile || ''}"`,
              `"${partner.fullName || ''}"`,
              `"+91 ${partner.phone || ''}"`,
              `"${partner.garbaStyle || ''}"`,
              `"${partner.area || ''}"`,
              `"${partner.socialProfile || ''}"`,
              `"${sharedNightsStr}"`,
              `"${new Date(u.updatedAt || u.createdAt).toISOString()}"`,
            ]);
          }
        }
      }
    }

    const csvContent = rows.map((r) => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="garba_matches_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user feedback and feature requests
 * @route   GET /api/admin/feedback
 */
const getFeedbackList = async (req, res, next) => {
  try {
    const Feedback = require('../models/Feedback');
    const feedbackList = await Feedback.find()
      .populate('userId', 'fullName phone city')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  executeBatchMatching,
  getMatchingStats,
  getAllUsers,
  blockUser,
  unblockUser,
  getAdminReports,
  getFeedbackList,
  getNotificationLogs,
  triggerTestNotification,
  seedDemoPartners,
  resetMatching,
  getMatchesOverview,
  manualUnmatch,
  manualMatch,
  exportMatchesCsv,
};



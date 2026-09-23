const EventLog = require('../models/EventLog');
const User = require('../models/User');

/**
 * @desc    Track lightweight privacy-preserving event (No PII)
 * @route   POST /api/analytics/track
 * @access  Public
 */
const trackEvent = async (req, res, next) => {
  try {
    const { eventType, city, deviceType, stepNumber, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({ success: false, message: 'Event type is required' });
    }

    // Determine device type if not passed
    let detectedDevice = deviceType || 'Unknown';
    if (detectedDevice === 'Unknown' && req.headers['user-agent']) {
      const ua = req.headers['user-agent'].toLowerCase();
      if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        detectedDevice = 'Mobile';
      } else {
        detectedDevice = 'Desktop';
      }
    }

    const event = await EventLog.create({
      eventType,
      city: city || 'Unknown',
      deviceType: detectedDevice,
      stepNumber: stepNumber || null,
      metadata: metadata || {},
    });

    return res.status(201).json({
      success: true,
      data: { eventId: event._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get growth analytics metrics & funnel conversion rates
 * @route   GET /api/admin/analytics
 * @access  Admin Protected
 */
const getAnalyticsDashboard = async (req, res, next) => {
  try {
    // 1. Group registrations by City
    const cityDistribution = await User.aggregate([
      { $group: { _id: '$city', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // 2. Solo vs Duo vs Group Distribution
    const groupFormatDistribution = await User.aggregate([
      { $group: { _id: '$groupSize', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Funnel Conversion Metrics from Event Logs
    const step1Events = await EventLog.countDocuments({
      eventType: 'Form_Step_Completed',
      stepNumber: 1,
    });

    const step2Events = await EventLog.countDocuments({
      eventType: 'Form_Step_Completed',
      stepNumber: 2,
    });

    const step3SuccessEvents = await EventLog.countDocuments({
      eventType: 'Registration_Success',
    });

    const totalRegistrations = await User.countDocuments();
    const totalPageViews = await EventLog.countDocuments({ eventType: 'Page_View' });
    const totalShares = await EventLog.countDocuments({ eventType: 'WhatsApp_Share_Clicked' });
    const totalUpiClicks = await EventLog.countDocuments({ eventType: 'UPI_QR_Clicked' });

    // Funnel conversion rate
    const step1Count = Math.max(step1Events, totalRegistrations);
    const completedCount = Math.max(step3SuccessEvents, totalRegistrations);
    const conversionRate = step1Count > 0 ? ((completedCount / step1Count) * 100).toFixed(1) : '100.0';

    // Device breakdown
    const deviceBreakdown = await EventLog.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        totalPageViews,
        totalShares,
        totalUpiClicks,
        conversionRate: `${conversionRate}%`,
        funnel: {
          step1Started: step1Count,
          step2Completed: Math.max(step2Events, totalRegistrations),
          step3Finished: completedCount,
          dropoffRate: step1Count > 0 ? `${(((step1Count - completedCount) / step1Count) * 100).toFixed(1)}%` : '0%',
        },
        cityDistribution,
        groupFormatDistribution,
        deviceBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  trackEvent,
  getAnalyticsDashboard,
};

const NotificationLog = require('../models/NotificationLog');

/**
 * Generate standard Navratri match notification message
 * @param {string} userName - User's name
 * @param {string} [city] - Gujarat City
 * @returns {string} Formatted WhatsApp message
 */
const getMatchMessageTemplate = (userName, city = 'Gujarat') => {
  const firstName = userName ? userName.split(' ')[0] : 'Garba Lover';
  return `Jay Mataji, ${firstName}! 🌸✨\n\nYour Garba partner match in ${city} for Navratri 2026 is ready on Find My Garba Partner! 💃🕺\n\nLog in now to view your match circle, see their preferred Garba styles, and start chatting securely (100% masked contact):\n👉 https://findmygarbapartner.com/dashboard\n\nShubhkamnao for a joyous Navratri! 🪔`;
};

/**
 * Send WhatsApp notification to a single user with fallback logging
 * @param {Object} user - Target user object
 * @param {number} [matchedCount=1] - Number of partners matched
 * @returns {Promise<Object>} Notification status result
 */
const sendMatchNotification = async (user, matchedCount = 1) => {
  const phone = user.phone;
  const name = user.fullName || 'User';
  const city = user.city || 'Vadodara';
  const messageText = getMatchMessageTemplate(name, city);

  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

  let deliveryStatus = 'Logged for Batch SMS';
  let details = 'Saved to dispatch ledger for automated carrier broadcast';

  // 1. Attempt external WhatsApp Webhook Dispatch (e.g., Baileys / WATI / Meta Cloud API)
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_API_KEY || ''}`,
        },
        body: JSON.stringify({
          to: `91${phone}`,
          recipientName: name,
          message: messageText,
          templateName: 'garba_match_alert_2026',
        }),
      });

      if (response.ok) {
        deliveryStatus = 'Delivered';
        details = `Dispatched successfully via WhatsApp Webhook Gateway (Status ${response.status})`;
      } else {
        const errText = await response.text();
        deliveryStatus = 'Logged for Batch SMS';
        details = `Webhook response ${response.status}: ${errText.slice(0, 100)}. Logged for fallback broadcast.`;
      }
    } catch (error) {
      deliveryStatus = 'Logged for Batch SMS';
      details = `Webhook connection issue: ${error.message}. Saved to local fallback broadcast ledger.`;
    }
  } else {
    // Zero-cost simulated / fallback mode
    deliveryStatus = 'Logged for Batch SMS';
    details = 'Platform running in lightweight mode. Notification queued in admin broadcast ledger.';
    console.log(`📱 [WhatsApp/SMS Dispatch Queue] To: +91-${phone} (${name}) -> "${messageText.replace(/\n/g, ' ')}"`);
  }

  // 2. Persist in database Notification Log
  try {
    const logEntry = await NotificationLog.create({
      userId: user._id,
      recipientPhone: phone,
      recipientName: name,
      channel: webhookUrl ? 'WhatsApp' : 'Fallback Broadcast Log',
      message: messageText,
      status: deliveryStatus,
      matchedWithCount: matchedCount,
      details,
    });

    return {
      success: true,
      logId: logEntry._id,
      phone,
      status: deliveryStatus,
      details,
    };
  } catch (logErr) {
    console.error('Failed to write notification log:', logErr.message);
    return {
      success: true,
      phone,
      status: deliveryStatus,
      details,
    };
  }
};

/**
 * Dispatch batch match notifications to multiple users
 * @param {Array<Object>} usersList - List of matched user documents
 * @returns {Promise<Array<Object>>} Dispatch results
 */
const sendBatchMatchNotifications = async (usersList) => {
  const results = [];
  for (const user of usersList) {
    try {
      const result = await sendMatchNotification(user, user.matchedWith?.length || 1);
      results.push(result);
    } catch (err) {
      console.error(`Error notifying user ${user._id}:`, err.message);
      results.push({
        success: false,
        phone: user.phone,
        status: 'Failed',
        details: err.message,
      });
    }
  }
  return results;
};

module.exports = {
  getMatchMessageTemplate,
  sendMatchNotification,
  sendBatchMatchNotifications,
};

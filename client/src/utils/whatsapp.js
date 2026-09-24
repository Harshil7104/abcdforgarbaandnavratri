/**
 * WhatsApp Deep Link Generator & Messaging Utility for "Find My Garba Partner"
 * Zero-cost, 1-click browser/mobile WhatsApp messaging
 */

/**
 * Format and normalize Indian phone numbers to E.164 without leading '+' or spaces
 * @param {string|number} rawPhone
 * @returns {string} e.g. "919825012345"
 */
export const normalizeWhatsAppPhone = (rawPhone) => {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
};

/**
 * Generate a pre-filled direct WhatsApp messaging link from one matched user to another
 */
export const generateUserMatchWhatsAppLink = ({
  partnerPhone,
  partnerName = 'Garba Partner',
  myName = '',
  city = 'Gujarat',
  garbaStyle = 'Garba',
}) => {
  const formattedPhone = normalizeWhatsAppPhone(partnerPhone);
  const cleanPartnerName = partnerName.trim().split(' ')[0] || 'Friend';
  const introName = myName ? ` I am ${myName.trim().split(' ')[0]}.` : '';

  const messageText = `Jay Mataji! 🌸 Hi ${cleanPartnerName}, we’ve been matched on Find My Garba Partner for Navratri 2026 in ${city}!${introName} Our shared Garba style is ${garbaStyle}. Let's connect and coordinate our passes and garba venues! 💃🕺\n\nhttps://findmygarbapartner.com`;

  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
};

/**
 * Generate a direct WhatsApp notification link for Admins to notify users of their match
 */
export const generateAdminMatchWhatsAppLink = ({
  recipientPhone,
  recipientName = 'Garba Enthusiast',
  partnerName = 'your matched partner',
  city = 'Gujarat',
}) => {
  const formattedPhone = normalizeWhatsAppPhone(recipientPhone);
  const cleanRecipientName = recipientName.trim().split(' ')[0] || 'Dancer';

  const messageText = `Jay Mataji! 🌸 Hi ${cleanRecipientName}, your Garba partner match (${partnerName}) is ready for Navratri 2026 in ${city} on Find My Garba Partner! 🪔\n\nLogin to your dashboard now to view profile details and start chatting:\nhttps://findmygarbapartner.com`;

  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
};

/**
 * Safely trigger WhatsApp deep link opening
 */
export const openWhatsApp = (url) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

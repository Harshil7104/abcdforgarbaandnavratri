/**
 * User Data Privacy & Response Sanitization DTOs
 */

/**
 * Mask an Indian phone number for public/partner display
 * Example: "9825012345" -> "+91 ****** 2345"
 * @param {string} phone - 10-digit phone number
 * @returns {string} Masked phone representation
 */
const maskPhoneNumber = (phone) => {
  if (!phone || phone.length < 4) return '+91 ****** ****';
  const lastFour = phone.slice(-4);
  return `+91 ****** ${lastFour}`;
};

/**
 * Mask full name to show only first name + initial for privacy
 * Example: "Kavya Shah" -> "Kavya S."
 * @param {string} fullName
 * @returns {string}
 */
const maskFullName = (fullName) => {
  if (!fullName) return 'Garba Dancer';
  const parts = fullName.trim().split(' ');
  if (parts.length <= 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0)}.`;
};

/**
 * Transform a user document into a safe, masked public DTO
 * Strictly eliminates passwords, internal report history, IPs, and full contact details
 * @param {Object} userDoc - Mongoose User Document or Lean Object
 * @param {boolean} [isSelf=false] - True if requesting user is viewing their own profile
 * @returns {Object} Clean sanitized DTO
 */
const sanitizeUserDto = (userDoc, isSelf = false) => {
  if (!userDoc) return null;

  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };

  // Always delete sensitive internal attributes
  delete user.password;
  delete user.__v;
  delete user.reports;
  delete user.blockedUsers;
  delete user.updatedAt;

  if (isSelf) {
    // Current user viewing their own profile gets their complete details
    return user;
  }

  // Public / Match partner view: enforce strict masking
  return {
    _id: user._id,
    fullName: maskFullName(user.fullName),
    phone: maskPhoneNumber(user.phone), // Masked
    gender: user.gender,
    city: user.city,
    area: user.area || '',
    garbaStyle: user.garbaStyle,
    groupSize: user.groupSize,
    nightAvailability: user.nightAvailability || [],
    socialProfile: user.socialProfile ? 'Verified Profile 🛡️' : '',
    matchStatus: user.matchStatus,
    createdAt: user.createdAt,
  };
};

/**
 * Sanitize a list of matched users
 * @param {Array<Object>} matchedList
 * @returns {Array<Object>}
 */
const sanitizeMatchedUsersList = (matchedList = []) => {
  return matchedList.map((partner) => sanitizeUserDto(partner, false));
};

module.exports = {
  maskPhoneNumber,
  maskFullName,
  sanitizeUserDto,
  sanitizeMatchedUsersList,
};

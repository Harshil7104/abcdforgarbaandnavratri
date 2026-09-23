/**
 * Script to create or promote an Admin User in Find My Garba Partner
 * Usage:
 *   node scripts/create-admin.js <phone> [password] [fullName]
 * Example:
 *   node scripts/create-admin.js 9999999999 Admin@123 "Garba Admin"
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const phone = process.argv[2] || '9999999999';
const password = process.argv[3] || 'admin12345';
const fullName = process.argv[4] || 'Admin Lead';

async function setupAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);

    let user = await User.findOne({ phone });

    if (user) {
      user.role = 'admin';
      if (process.argv[3]) {
        user.password = password; // Will be hashed by pre-save hook
      }
      await user.save();
      console.log(`\n✅ Existing user ${user.fullName} (+91-${user.phone}) has been promoted to ADMIN!`);
    } else {
      user = await User.create({
        fullName,
        phone,
        password,
        role: 'admin',
        gender: 'Prefer not to say',
        city: 'Vadodara',
        area: 'Admin HQ',
        garbaStyle: 'All Styles',
        groupSize: 'Solo',
        nightAvailability: ['All 9 Nights'],
        socialProfile: '@findmygarbapartner_official',
      });
      console.log(`\n🎉 New ADMIN user created successfully!`);
    }

    console.log(`\n--------------------------------------------`);
    console.log(`🔑 Admin Login Credentials:`);
    console.log(`📱 Phone Number: ${user.phone}`);
    console.log(`🔒 Password:     ${password}`);
    console.log(`🛡️  Role:         ${user.role}`);
    console.log(`--------------------------------------------`);
    console.log(`\nYou can now log in via the web app using these credentials to access the Admin Runner.\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    process.exit(1);
  }
}

setupAdmin();

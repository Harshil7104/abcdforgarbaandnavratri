/**
 * Mock Data Generator Script for Find My Garba Partner
 * Inserts 40+ realistic Gujarati Navratri user profiles across Gujarat cities
 * Usage:
 *   node scripts/seedUsers.js
 *   or: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const mockUsersData = [
  // =================== VADODARA (Cultural Capital) ===================
  {
    fullName: 'Diya Patel',
    phone: '9825011001',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Vadodara',
    area: 'Vasna Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@diya_garba_vdr',
  },
  {
    fullName: 'Aarav Shah',
    phone: '9825011002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Vadodara',
    area: 'Vasna Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3', 'Night 6', 'Night 7'],
    socialProfile: '@aarav.garba.official',
  },
  {
    fullName: 'Pooja Mehta',
    phone: '9825011003',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Vadodara',
    area: 'Alkapuri',
    garbaStyle: 'Dodhiya',
    groupSize: 'Duo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5', 'Night 6'],
    socialProfile: '@pooja_mehta_dance',
  },
  {
    fullName: 'Parth Joshi',
    phone: '9825011004',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Vadodara',
    area: 'Alkapuri',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@parth_vdr_unitedway',
  },
  {
    fullName: 'Riddhi Desai',
    phone: '9825011005',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Vadodara',
    area: 'Gotri',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 5', 'Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@riddhi_desai_trad',
  },
  {
    fullName: 'Siddharth Trivedi',
    phone: '9825011006',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Vadodara',
    area: 'Gotri',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 5', 'Night 6', 'Night 7'],
    socialProfile: '@sid_trivedi_raas',
  },
  {
    fullName: 'Krunal Barot',
    phone: '9825011007',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Vadodara',
    area: 'Karelibaug',
    garbaStyle: 'Popat',
    groupSize: 'Group (3+)',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@krunal_barot_navratri',
  },
  {
    fullName: 'Nidhi Pandya',
    phone: '9825011008',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Vadodara',
    area: 'Manjalpur',
    garbaStyle: 'All Styles',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@nidhi_pandya_dance',
  },
  {
    fullName: 'Harshil Soni',
    phone: '9825011009',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Vadodara',
    area: 'Akota',
    garbaStyle: 'Dandiya',
    groupSize: 'Duo',
    nightAvailability: ['Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@harshil_dandiya_king',
  },
  {
    fullName: 'Tanvi Dave',
    phone: '9825011010',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Vadodara',
    area: 'Fatehgunj',
    garbaStyle: 'Free Style',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 8', 'Night 9'],
    socialProfile: '@tanvi_msu_garba',
  },

  // =================== AHMEDABAD (Amdavad Garba) ===================
  {
    fullName: 'Ananya Joshi',
    phone: '9825022001',
    password: 'garbaUser123',
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
    phone: '9825022002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Ahmedabad',
    area: 'SG Highway',
    garbaStyle: 'Popat',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4'],
    socialProfile: '@jayesh_navratri_amd',
  },
  {
    fullName: 'Kavita Solanki',
    phone: '9825022003',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Ahmedabad',
    area: 'Prahlad Nagar',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@kavita_solanki_garba',
  },
  {
    fullName: 'Mehul Vora',
    phone: '9825022004',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Ahmedabad',
    area: 'Prahlad Nagar',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3'],
    socialProfile: '@mehul_vora_ahmedabad',
  },
  {
    fullName: 'Bhavna Gadhvi',
    phone: '9825022005',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Ahmedabad',
    area: 'Bodakdev',
    garbaStyle: 'Tran Tali',
    groupSize: 'Group (3+)',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@bhavna_gadhvi_folk',
  },
  {
    fullName: 'Devang Vyas',
    phone: '9825022006',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Ahmedabad',
    area: 'Satellite',
    garbaStyle: 'Dandiya',
    groupSize: 'Solo',
    nightAvailability: ['Night 4', 'Night 5', 'Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@devang_vyas_raas',
  },
  {
    fullName: 'Janki Rathod',
    phone: '9825022007',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Ahmedabad',
    area: 'Satellite',
    garbaStyle: 'Dandiya',
    groupSize: 'Solo',
    nightAvailability: ['Night 5', 'Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@janki_dandiya_amd',
  },
  {
    fullName: 'Ravi Panchal',
    phone: '9825022008',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Ahmedabad',
    area: 'Bopal',
    garbaStyle: 'All Styles',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@ravi_panchal_navratri',
  },
  {
    fullName: 'Mitali Parekh',
    phone: '9825022009',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    garbaStyle: 'Free Style',
    groupSize: 'Duo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@mitali_parekh_dance',
  },
  {
    fullName: 'Yashwardhan Raval',
    phone: '9825022010',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    garbaStyle: 'Free Style',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@yash_raval_garba',
  },

  // =================== SURAT (Diamond City Garba) ===================
  {
    fullName: 'Pooja Desai',
    phone: '9825033001',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Surat',
    area: 'Adajan',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@pooja_surat_garba',
  },
  {
    fullName: 'Hardik Trivedi',
    phone: '9825033002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Surat',
    area: 'Adajan',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@hardik_surat_dandiya',
  },
  {
    fullName: 'Drashti Patel',
    phone: '9825033003',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Surat',
    area: 'Vesu',
    garbaStyle: 'Dodhiya',
    groupSize: 'Duo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@drashti_patel_vesu',
  },
  {
    fullName: 'Kishan Choksi',
    phone: '9825033004',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Surat',
    area: 'Vesu',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5', 'Night 6'],
    socialProfile: '@kishan_choksi_garba',
  },
  {
    fullName: 'Shreya Kanakia',
    phone: '9825033005',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Surat',
    area: 'City Light',
    garbaStyle: 'Popat',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@shreya_kanakia_dance',
  },
  {
    fullName: 'Gaurav Kheni',
    phone: '9825033006',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Surat',
    area: 'City Light',
    garbaStyle: 'Popat',
    groupSize: 'Group (3+)',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@gaurav_surat_garba',
  },
  {
    fullName: 'Sneha Moradiya',
    phone: '9825033007',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Surat',
    area: 'Piplod',
    garbaStyle: 'Dandiya',
    groupSize: 'Solo',
    nightAvailability: ['Night 4', 'Night 5', 'Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '@sneha_dandiya_surat',
  },
  {
    fullName: 'Bhavin Sutariya',
    phone: '9825033008',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Surat',
    area: 'Varachha',
    garbaStyle: 'All Styles',
    groupSize: 'Group (3+)',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@bhavin_surat_circle',
  },

  // =================== RAJKOT (Kathiyawadi Rangoli Garba) ===================
  {
    fullName: 'Jayshreeba Jadeja',
    phone: '9825044001',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Rajkot',
    area: 'Race Course',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@jayshreeba_kathiyawadi',
  },
  {
    fullName: 'Kuldeepsinh Vaghela',
    phone: '9825044002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Rajkot',
    area: 'Race Course',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@kuldeep_rajkot_raas',
  },
  {
    fullName: 'Rupal Radadiya',
    phone: '9825044003',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Rajkot',
    area: 'Kalawad Road',
    garbaStyle: 'Popat',
    groupSize: 'Duo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@rupal_radadiya_garba',
  },
  {
    fullName: 'Chirag Bhalodiya',
    phone: '9825044004',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Rajkot',
    area: 'Kalawad Road',
    garbaStyle: 'Popat',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@chirag_rajkot_heench',
  },
  {
    fullName: 'Kinjal Gadhvi',
    phone: '9825044005',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Rajkot',
    area: 'University Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@kinjal_gadhvi_garba',
  },
  {
    fullName: 'Vipul Makwana',
    phone: '9825044006',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Rajkot',
    area: 'University Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Group (3+)',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@vipul_rajkot_group',
  },

  // =================== ANAND & BHAVNAGAR ===================
  {
    fullName: 'Hemaxi Patel',
    phone: '9825055001',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Anand',
    area: 'BVM Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@hemaxi_charotar_garba',
  },
  {
    fullName: 'Dhaval Amin',
    phone: '9825055002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Anand',
    area: 'BVM Road',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights'],
    socialProfile: '@dhaval_amin_bvm',
  },
  {
    fullName: 'Priyal Shah',
    phone: '9825066001',
    password: 'garbaUser123',
    gender: 'Female',
    city: 'Bhavnagar',
    area: 'Kalanala',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@priyal_bhavnagar_garba',
  },
  {
    fullName: 'Jaimin Gohil',
    phone: '9825066002',
    password: 'garbaUser123',
    gender: 'Male',
    city: 'Bhavnagar',
    area: 'Kalanala',
    garbaStyle: 'Tran Tali',
    groupSize: 'Solo',
    nightAvailability: ['Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5'],
    socialProfile: '@jaimin_gohil_raas',
  },
];

async function seedDatabase() {
  console.log(`\n======================================================`);
  console.log(`🌱 Find My Garba Partner - Mock User Seeder`);
  console.log(`======================================================\n`);

  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    let createdCount = 0;
    let existingCount = 0;

    for (const profile of mockUsersData) {
      const exists = await User.findOne({ phone: profile.phone });
      if (exists) {
        existingCount++;
      } else {
        await User.create(profile);
        createdCount++;
        console.log(`✨ Created: ${profile.fullName} (+91-${profile.phone}) | ${profile.city} (${profile.area}) | Style: ${profile.garbaStyle}`);
      }
    }

    console.log(`\n------------------------------------------------------`);
    console.log(`📊 Seeding Results:`);
    console.log(`   • Newly Inserted Profiles: ${createdCount}`);
    console.log(`   • Pre-existing Profiles:  ${existingCount}`);
    console.log(`   • Total Database Users:    ${await User.countDocuments()}`);
    console.log(`------------------------------------------------------`);
    console.log(`\n💡 Password for all generated users: "garbaUser123"`);
    console.log(`🚀 You can now trigger the matching engine to pair them up!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();

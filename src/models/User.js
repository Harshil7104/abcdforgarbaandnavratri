const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const indianPhoneRegex = /^[6-9]\d{9}$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return indianPhoneRegex.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit Indian mobile number. It must start with 6, 7, 8, or 9.`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password by default in queries
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Non-Binary', 'Prefer not to say'],
        message: '{VALUE} is not a supported gender option',
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Vadodara',
      enum: {
        values: [
          'Vadodara',
          'Ahmedabad',
          'Surat',
          'Rajkot',
          'Bhavnagar',
          'Jamnagar',
          'Gandhinagar',
          'Junagadh',
          'Anand / V.V. Nagar',
          'Navsari',
          'Valsad / Vapi',
          'Morbi',
          'Other',
        ],
        message: '{VALUE} is not in the supported Gujarat cities list',
      },
    },
    area: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Area name cannot exceed 100 characters'],
    },
    garbaStyle: {
      type: String,
      required: [true, 'Garba style preference is required'],
      enum: {
        values: ['Popat', 'Dodhiya', 'Tran Tali', 'Dandiya', 'Free Style', 'All Styles'],
        message: '{VALUE} is not a valid Garba style option',
      },
    },
    groupSize: {
      type: String,
      required: [true, 'Group size preference is required'],
      enum: {
        values: ['Solo', 'Duo', 'Group (3+)'],
        message: '{VALUE} is not a valid group size',
      },
    },
    nightAvailability: {
      type: [String],
      default: ['All 9 Nights'],
    },
    socialProfile: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
    },
    matchStatus: {
      type: String,
      default: 'Pending',
      enum: {
        values: ['Pending', 'Matched', 'Unmatched', 'Blocked'],
        message: '{VALUE} is not a valid match status',
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    matchedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reports: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, default: 'General report' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

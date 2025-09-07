const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orgInfo: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Government', 'NGO', 'Industry', 'Startup', 'Educational'],
      required: true,
    },
    description: String,
    website: String,
    contactPerson: {
      name: String,
      position: String,
      email: String,
      phone: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    logo: {
      filename: String,
      originalName: String,
      path: String,
    },
  },
  sector: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['Small (<50)', 'Medium (50-200)', 'Large (200-1000)', 'Very Large (>1000)'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  capacity: {
    maxInterns: {
      type: Number,
      default: 10,
    },
    currentInterns: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Organization', organizationSchema);
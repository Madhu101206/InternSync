const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  requiredSkills: [String],
  preferredSkills: [String],
  location: {
    type: String,
    required: true,
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['weeks', 'months'],
      default: 'months',
    },
  },
  stipend: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  startDate: Date,
  applicationDeadline: Date,
  capacity: {
    type: Number,
    default: 1,
  },
  currentApplications: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'completed'],
    default: 'draft',
  },
  requirements: {
    minCGPA: Number,
    minYearOfStudy: String,
    specificQualifications: [String],
  },
  equityPreferences: {
    reservedForWomen: {
      type: Boolean,
      default: false,
    },
    reservedForCategories: [{
      type: String,
      enum: ['SC', 'ST', 'OBC', 'EWS', 'PWD'],
    }],
    preferredFromRural: {
      type: Boolean,
      default: false,
    },
    preferredFromAspirationalDistricts: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Internship', internshipSchema);
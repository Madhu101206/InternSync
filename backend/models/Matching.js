const mongoose = require('mongoose');

const matchingSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  studentApplications: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    ranking: Number,
    status: {
      type: String,
      enum: ['pending', 'recommended', 'not_recommended', 'selected', 'rejected'],
      default: 'pending',
    },
  }],
  matchingCriteria: {
    skillWeight: {
      type: Number,
      default: 0.4,
    },
    interestWeight: {
      type: Number,
      default: 0.2,
    },
    locationWeight: {
      type: Number,
      default: 0.2,
    },
    equityWeight: {
      type: Number,
      default: 0.2,
    },
    ruralBoost: {
      type: Number,
      default: 0.05,
    },
    aspirationalDistrictBoost: {
      type: Number,
      default: 0.05,
    },
  },
  reservationQuotas: {
    sc: {
      type: Number,
      default: 15,
    },
    st: {
      type: Number,
      default: 7.5,
    },
    obc: {
      type: Number,
      default: 27,
    },
    ews: {
      type: Number,
      default: 10,
    },
    women: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
  },
  completedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Matching', matchingSchema);
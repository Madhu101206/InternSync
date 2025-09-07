const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
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
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected', 'withdrawn'],
    default: 'applied',
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  matchingFactors: {
    skillMatch: Number,
    interestMatch: Number,
    locationMatch: Number,
    equityBoost: Number,
  },
  organizationFeedback: {
    rating: Number,
    comments: String,
    feedbackDate: Date,
  },
  studentFeedback: {
    rating: Number,
    comments: String,
    feedbackDate: Date,
  },
  isPlacementSuccessful: {
    type: Boolean,
    default: false,
  },
  offerAccepted: {
    type: Boolean,
    default: false,
  },
  offerDate: Date,
  joiningDate: Date,
}, {
  timestamps: true,
});

// Create compound index to ensure one application per student per internship
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
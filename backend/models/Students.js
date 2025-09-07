const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    aadhaarNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    collegeId: String,
  },
  academicInfo: {
    institution: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    yearOfStudy: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', '5th', 'Graduated'],
    },
    cgpa: Number,
    expectedGraduation: Date,
  },
  socialCategory: {
    type: String,
    enum: ['General', 'SC', 'ST', 'OBC', 'EWS'],
    required: true,
  },
  demographicInfo: {
    state: String,
    district: String,
    pincode: String,
    isRural: Boolean,
    isFromAspirationalDistrict: Boolean,
  },
  skills: [String],
  interests: [String],
  preferredLocations: [String],
  preferredDomains: [String],
  resume: {
    filename: String,
    originalName: String,
    path: String,
    parsedData: {
      skills: [String],
      education: [{
        institution: String,
        degree: String,
        field: String,
        year: Number,
      }],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String,
      }],
    },
  },
  pastInternships: [{
    title: String,
    organization: String,
    duration: String,
    description: String,
  }],
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
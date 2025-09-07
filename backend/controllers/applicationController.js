const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const { sendApplicationStatusEmail } = require('../utils/emailService');
const { calculateMatchScore } = require('../utils/matchingAlgorithm');

// Apply for internship
const applyForInternship = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const internship = await Internship.findById(req.params.internshipId)
      .populate('organizationId');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      studentId: student._id,
      internshipId: internship._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this internship' });
    }

    // Check if application deadline has passed
    if (internship.applicationDeadline && new Date() > internship.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Calculate match score
    const matchingCriteria = {
      skillWeight: 0.4,
      interestWeight: 0.2,
      locationWeight: 0.2,
      equityWeight: 0.2,
      ruralBoost: 0.05,
      aspirationalDistrictBoost: 0.05
    };

    const { totalScore, factors } = calculateMatchScore(student, internship, matchingCriteria);

    // Create application
    const application = await Application.create({
      studentId: student._id,
      internshipId: internship._id,
      organizationId: internship.organizationId._id,
      matchScore: totalScore,
      matchingFactors: factors
    });

    // Update internship application count
    await Internship.findByIdAndUpdate(
      internship._id,
      { $inc: { currentApplications: 1 } }
    );

    // Send confirmation email
    await sendApplicationStatusEmail(
      req.user.email,
      `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
      internship.title,
      'applied'
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const application = await Application.findOneAndUpdate(
      { 
        _id: req.params.applicationId,
        studentId: student._id 
      },
      { status: 'withdrawn' },
      { new: true }
    ).populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update internship application count
    await Internship.findByIdAndUpdate(
      application.internshipId._id,
      { $inc: { currentApplications: -1 } }
    );

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get application details
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId')
      .populate('internshipId')
      .populate('organizationId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyForInternship,
  withdrawApplication,
  getApplication
};
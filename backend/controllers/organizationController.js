const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// Get organization profile
const getProfile = async (req, res) => {
  try {
    const organization = await Organization.findOne({ userId: req.user._id });
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update organization profile
const updateProfile = async (req, res) => {
  try {
    const organization = await Organization.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const organization = await Organization.findOne({ userId: req.user._id });
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    organization.orgInfo.logo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path
    };

    await organization.save();

    res.json({
      message: 'Logo uploaded successfully',
      logo: organization.orgInfo.logo
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get organization internships
const getInternships = async (req, res) => {
  try {
    const organization = await Organization.findOne({ userId: req.user._id });
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    const internships = await Internship.find({ organizationId: organization._id })
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get applications for internship
const getInternshipApplications = async (req, res) => {
  try {
    const { internshipId } = req.params;
    
    const applications = await Application.find({ internshipId })
      .populate('studentId')
      .sort({ matchScore: -1 });

    res.json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { 
        status,
        ...(feedback && { organizationFeedback: {
          rating: feedback.rating,
          comments: feedback.comments,
          feedbackDate: new Date()
        }})
      },
      { new: true }
    ).populate('studentId').populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadLogo,
  getInternships,
  getInternshipApplications,
  updateApplicationStatus
};
const Student = require('../models/Student');
const Application = require('../models/Application');
const { parseResume } = require('../utils/resumeParser');

// Get student profile
const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student profile
const updateProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body, isProfileComplete: true },
      { new: true, runValidators: true }
    );

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload and parse resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Parse resume
    const parsedData = await parseResume(req.file.path);

    // Update student with resume info
    student.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      parsedData
    };

    // Update skills from resume if not already set
    if (parsedData.skills && parsedData.skills.length > 0) {
      student.skills = [...new Set([...student.skills, ...parsedData.skills])];
    }

    await student.save();

    res.json({
      message: 'Resume uploaded successfully',
      resume: student.resume
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get student applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.params.studentId })
      .populate('internshipId')
      .populate('organizationId')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get recommended internships
const getRecommendedInternships = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // This would be replaced with actual recommendation logic
    // For now, return a placeholder response
    res.json({
      message: 'Recommendation feature will be implemented soon',
      studentSkills: student.skills,
      studentInterests: student.interests
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get skill gap analysis
const getSkillGapAnalysis = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // This would be replaced with actual skill gap analysis
    // For now, return a placeholder response
    res.json({
      message: 'Skill gap analysis feature will be implemented soon',
      internshipId,
      studentSkills: student.skills
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getApplications,
  getRecommendedInternships,
  getSkillGapAnalysis
};
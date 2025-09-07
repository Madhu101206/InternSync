const User = require('../models/User');
const Student = require('../models/Student');
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Matching = require('../models/Matching');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalOrganizations,
      totalInternships,
      totalApplications,
      publishedInternships,
      closedInternships,
      recentMatchings
    ] = await Promise.all([
      Student.countDocuments(),
      Organization.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Internship.countDocuments({ status: 'published' }),
      Internship.countDocuments({ status: 'closed' }),
      Matching.find().sort({ createdAt: -1 }).limit(5).populate('internshipId')
    ]);

    // Get category distribution
    const categoryDistribution = await Student.aggregate([
      { $group: { _id: '$socialCategory', count: { $sum: 1 } } }
    ]);

    // Get gender distribution
    const genderDistribution = await Student.aggregate([
      { $group: { _id: '$personalInfo.gender', count: { $sum: 1 } } }
    ]);

    // Get domain distribution
    const domainDistribution = await Internship.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totals: {
        students: totalStudents,
        organizations: totalOrganizations,
        internships: totalInternships,
        applications: totalApplications,
        publishedInternships,
        closedInternships
      },
      distributions: {
        categories: categoryDistribution,
        genders: genderDistribution,
        domains: domainDistribution
      },
      recentMatchings
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all students with filters
const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      state,
      isProfileComplete
    } = req.query;

    const filter = {};

    if (category) filter.socialCategory = category;
    if (state) filter['demographicInfo.state'] = new RegExp(state, 'i');
    if (isProfileComplete !== undefined) filter.isProfileComplete = isProfileComplete === 'true';

    const students = await Student.find(filter)
      .populate('userId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all organizations with filters
const getOrganizations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      sector,
      isVerified
    } = req.query;

    const filter = {};

    if (type) filter['orgInfo.type'] = type;
    if (sector) filter.sector = new RegExp(sector, 'i');
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const organizations = await Organization.find(filter)
      .populate('userId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Organization.countDocuments(filter);

    res.json({
      organizations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify organization
const verifyOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { isVerified: true },
      { new: true }
    ).populate('userId');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get system configuration
const getSystemConfig = async (req, res) => {
  try {
    // This would typically come from a configuration collection
    // For now, returning default values
    const config = {
      matchingAlgorithm: 'weighted',
      reservationPolicies: {
        sc: 15,
        st: 7.5,
        obc: 27,
        ews: 10,
        women: 0
      },
      weights: {
        skills: 0.4,
        interests: 0.2,
        location: 0.2,
        equity: 0.2
      },
      boosts: {
        rural: 0.05,
        aspirationalDistrict: 0.05
      },
      emailNotifications: {
        applicationStatus: true,
        matchingResults: true,
        periodicReports: true
      }
    };

    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update system configuration
const updateSystemConfig = async (req, res) => {
  try {
    // This would typically update a configuration collection
    // For now, just returning the received configuration
    res.json({
      message: 'System configuration updated successfully',
      config: req.body
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get fairness reports
const getFairnessReports = async (req, res) => {
  try {
    // This would generate comprehensive fairness reports
    // For now, returning placeholder data
    
    const reports = {
      categoryRepresentation: {
        target: { sc: 15, st: 7.5, obc: 27, ews: 10, general: 40.5 },
        actual: { sc: 14, st: 8, obc: 26, ews: 11, general: 41 },
        status: 'balanced'
      },
      genderRepresentation: {
        target: { male: 50, female: 50, other: 0 },
        actual: { male: 55, female: 44, other: 1 },
        status: 'needs_improvement'
      },
      regionalRepresentation: {
        north: 35,
        south: 28,
        east: 18,
        west: 19,
        status: 'balanced'
      },
      algorithmBias: {
        status: 'no_bias_detected',
        lastAudit: new Date()
      }
    };

    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  getOrganizations,
  verifyOrganization,
  getSystemConfig,
  updateSystemConfig,
  getFairnessReports
};
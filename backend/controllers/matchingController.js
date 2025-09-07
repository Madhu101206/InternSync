const Matching = require('../models/Matching');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const { calculateMatchScore, applyReservationPolicies } = require('../utils/matchingAlgorithm');

// Run matching for an internship
const runMatching = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { matchingCriteria, reservationQuotas } = req.body;

    const internship = await Internship.findById(internshipId)
      .populate('organizationId');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Get all applications for this internship
    const applications = await Application.find({ internshipId })
      .populate('studentId')
      .sort({ matchScore: -1 });

    if (applications.length === 0) {
      return res.status(400).json({ message: 'No applications found for this internship' });
    }

    // Create matching record
    const matching = await Matching.create({
      internshipId,
      organizationId: internship.organizationId._id,
      studentApplications: applications.map(app => ({
        studentId: app.studentId._id,
        applicationId: app._id,
        matchScore: app.matchScore,
        ranking: 0, // Will be updated after applying policies
        status: 'pending'
      })),
      matchingCriteria: matchingCriteria || {
        skillWeight: 0.4,
        interestWeight: 0.2,
        locationWeight: 0.2,
        equityWeight: 0.2,
        ruralBoost: 0.05,
        aspirationalDistrictBoost: 0.05
      },
      reservationQuotas: reservationQuotas || {
        sc: 15,
        st: 7.5,
        obc: 27,
        ews: 10,
        women: 0
      },
      status: 'in_progress'
    });

    // Apply reservation policies
    const selectedApplications = applyReservationPolicies(
      applications,
      matching.reservationQuotas
    );

    // Update matching record with results
    matching.studentApplications.forEach(app => {
      const selectedApp = selectedApplications.find(a => a._id.toString() === app.applicationId.toString());
      if (selectedApp) {
        app.status = 'recommended';
        app.ranking = selectedApplications.indexOf(selectedApp) + 1;
      } else {
        app.status = 'not_recommended';
      }
    });

    matching.status = 'completed';
    matching.completedAt = new Date();
    await matching.save();

    res.json({
      message: 'Matching completed successfully',
      matchingId: matching._id,
      totalApplications: applications.length,
      selectedCount: selectedApplications.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get matching results
const getMatchingResults = async (req, res) => {
  try {
    const { matchingId } = req.params;

    const matching = await Matching.findById(matchingId)
      .populate('internshipId')
      .populate('organizationId')
      .populate({
        path: 'studentApplications.studentId',
        model: 'Student'
      })
      .populate({
        path: 'studentApplications.applicationId',
        model: 'Application'
      });

    if (!matching) {
      return res.status(404).json({ message: 'Matching results not found' });
    }

    res.json(matching);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all matchings for an internship
const getInternshipMatchings = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const matchings = await Matching.find({ internshipId })
      .populate('internshipId')
      .sort({ createdAt: -1 });

    res.json(matchings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get matching statistics
const getMatchingStatistics = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const matchings = await Matching.find({ internshipId })
      .populate('internshipId');

    if (matchings.length === 0) {
      return res.status(404).json({ message: 'No matching data found' });
    }

    const latestMatching = matchings[0];
    
    const statistics = {
      totalMatchings: matchings.length,
      latestMatchingDate: latestMatching.completedAt,
      totalApplications: latestMatching.studentApplications.length,
      recommended: latestMatching.studentApplications.filter(a => a.status === 'recommended').length,
      notRecommended: latestMatching.studentApplications.filter(a => a.status === 'not_recommended').length,
      categoryDistribution: {
        general: 0,
        sc: 0,
        st: 0,
        obc: 0,
        ews: 0
      },
      genderDistribution: {
        male: 0,
        female: 0,
        other: 0
      }
    };

    // This would be populated with actual data from student profiles
    // For now, returning basic structure

    res.json(statistics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  runMatching,
  getMatchingResults,
  getInternshipMatchings,
  getMatchingStatistics
};
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  getApplications,
  getRecommendedInternships,
  getSkillGapAnalysis
} = require('../controllers/studentController');
const { auth, authorize } = require('../middleware/auth');
const { uploadResume: resumeUpload } = require('../middleware/upload');

router.use(auth);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-resume', resumeUpload.single('resume'), uploadResume);
router.get('/applications/:studentId', getApplications);
router.get('/recommended-internships', getRecommendedInternships);
router.get('/skill-gap-analysis/:internshipId', getSkillGapAnalysis);

module.exports = router;
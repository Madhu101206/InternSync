const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadLogo,
  getInternships,
  getInternshipApplications,
  updateApplicationStatus
} = require('../controllers/organizationController');
const { auth, authorize } = require('../middleware/auth');
const { uploadLogo: logoUpload } = require('../middleware/upload');

router.use(auth);
router.use(authorize('organization'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-logo', logoUpload.single('logo'), uploadLogo);
router.get('/internships', getInternships);
router.get('/internships/:internshipId/applications', getInternshipApplications);
router.put('/applications/:applicationId', updateApplicationStatus);

module.exports = router;
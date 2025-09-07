const express = require('express');
const router = express.Router();
const {
  applyForInternship,
  withdrawApplication,
  getApplication
} = require('../controllers/applicationController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.post('/internships/:internshipId/apply', authorize('student'), applyForInternship);
router.put('/:applicationId/withdraw', authorize('student'), withdrawApplication);
router.get('/:id', getApplication);

module.exports = router;
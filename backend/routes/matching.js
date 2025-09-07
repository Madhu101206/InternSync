const express = require('express');
const router = express.Router();
const {
  runMatching,
  getMatchingResults,
  getInternshipMatchings,
  getMatchingStatistics
} = require('../controllers/matchingController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin', 'organization'));

router.post('/internships/:internshipId', runMatching);
router.get('/:matchingId', getMatchingResults);
router.get('/internships/:internshipId/matchings', getInternshipMatchings);
router.get('/internships/:internshipId/statistics', getMatchingStatistics);

module.exports = router;
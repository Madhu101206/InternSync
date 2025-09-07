const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getInternships);
router.get('/:id', getInternship);

// Protected routes
router.use(auth);
router.post('/', authorize('organization'), createInternship);
router.put('/:id', authorize('organization'), updateInternship);
router.delete('/:id', authorize('organization'), deleteInternship);

module.exports = router;
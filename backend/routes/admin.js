const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getStudents,
  getOrganizations,
  verifyOrganization,
  getSystemConfig,
  updateSystemConfig,
  getFairnessReports
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudents);
router.get('/organizations', getOrganizations);
router.put('/organizations/:organizationId/verify', verifyOrganization);
router.get('/system-config', getSystemConfig);
router.put('/system-config', updateSystemConfig);
router.get('/fairness-reports', getFairnessReports);

module.exports = router;
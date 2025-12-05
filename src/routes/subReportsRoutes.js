const express = require('express');
const router = express.Router();
const {
  getHouseStatus,
  getMOPWiseCashierReport,
  getRevenueAnalysis,
  getInHouseGuestDueBalance,
  get10DaysForecast
} = require('../controllers/subReportsController');
const { auth } = require('../middleware/auth.js');

// All routes require authentication
router.use(auth);

// Sub-report routes
router.get('/house-status/:date', getHouseStatus);
router.get('/mop-cashier/:date', getMOPWiseCashierReport);
router.get('/revenue-analysis/:date', getRevenueAnalysis);
router.get('/due-balance', getInHouseGuestDueBalance);
router.get('/forecast/:date', get10DaysForecast);

module.exports = router;
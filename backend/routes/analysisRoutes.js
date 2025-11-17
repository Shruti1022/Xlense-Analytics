const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateCharts, mapData, getChartHistory, saveChart, deleteChart } = require('../controllers/analysisController');

router.route('/generate-charts/:id').post(protect, generateCharts);
router.route('/map-data/:id').post(protect, mapData);
router.route('/chart-history').get(protect, getChartHistory);
router.route('/save-chart').post(protect, saveChart);
router.route('/chart-history/:id').delete(protect, deleteChart);

module.exports = router;

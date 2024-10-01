const express = require('express');
const { Op } = require('sequelize');
const logApiRequest = require('../middleware/logApiRequest');
const reportController = require('../controllers/reportController.js');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware.js');
const router = express.Router();

// Validate PAN
router
    .route('/mis-report')
    .get(verifyToken, logApiRequest, verifyAdmin, reportController.getMisReport);
router
    .route('/mis-download')
    .get(verifyToken, logApiRequest, verifyAdmin, reportController.downloadMisReport);



module.exports = router;

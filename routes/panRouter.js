const express = require('express');
const logApiRequest = require('../middleware/logApiRequest');
const { verifyToken } = require('../middleware/authMiddleware');
const panController = require('../controllers/panController');
const router = express.Router();

// Validate PAN
router
    .route('/')
    .post(verifyToken, logApiRequest, panController.getPanValidation);

module.exports = router;

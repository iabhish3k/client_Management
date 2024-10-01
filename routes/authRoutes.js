const express = require('express');
const { register, login, protectedRoute } = require('../controllers/authController');
const logApiRequest = require('../middleware/logApiRequest');
const router = express.Router();

// Register route
router.post('/register', logApiRequest, register);
// Login route
router.post('/login', logApiRequest, login);

module.exports = router;

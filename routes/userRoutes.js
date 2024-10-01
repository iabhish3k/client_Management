const express = require('express');
const userController = require('../controllers/userController');
const logApiRequest = require('../middleware/logApiRequest');
const { verifyToken, verifyAdminOrClient } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users and create a new user
router
    .route('/')
    .get(verifyToken, logApiRequest, verifyAdminOrClient, userController.getAllUsers)
    .post(verifyToken, logApiRequest, verifyAdminOrClient, userController.createUser);

// Get user by ID, update user, and delete user
router
    .route('/:id')
    .get(verifyToken, logApiRequest, verifyAdminOrClient, userController.getUserById)
    .put(verifyToken, logApiRequest, verifyAdminOrClient, userController.updateUser)
    .delete(verifyToken, logApiRequest, verifyAdminOrClient, userController.deleteUser);

module.exports = router;

const express = require('express');
const clientController = require('../controllers/clientController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const logApiRequest = require('../middleware/logApiRequest');

const router = express.Router();

// Create a new client and get all clients
router
    .route('/')
    .post(verifyToken, logApiRequest, verifyAdmin, clientController.createClient)
    .get(verifyToken, logApiRequest, verifyAdmin, clientController.getAllClients);
router
    .route('/list')
    .get(verifyToken, logApiRequest, verifyAdmin, clientController.getClientList)

// Get, update, and delete a client by ID
router
    .route('/:id')
    .get(verifyToken, logApiRequest, verifyAdmin, clientController.getClientById)
    .put(verifyToken, logApiRequest, verifyAdmin, clientController.updateClient)
    .delete(verifyToken, logApiRequest, verifyAdmin, clientController.deleteClient);

module.exports = router;

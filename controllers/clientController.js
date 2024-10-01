const Client = require('../models/Client');
const User = require('../models/User');
const { Op } = require('sequelize');

const { clientSchema, clientUpdateSchema } = require('../validations/clientValidation');

// Create a new client
exports.createClient = async (req, res) => {
  const { error } = clientSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const { name, industry, phone, email, password } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // First, create the client
    const client = await Client.create({
      name,
      industry,
      phone,
      email,
    });

    // Create the user and associate with the newly created client
    const user = await User.create({
      name,
      email,
      password,
      role: 'client',
      clientId: client.id
    });

    return res.status(201).json({
      success: true,
      message: 'Client and user created successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating client and user',
      error: error.message,
    });
  }
};


// Get all clients with pagination
exports.getAllClients = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  // Calculate the offset for the query
  const offset = (page - 1) * limit;

  try {
    // Fetch clients with pagination
    const { count, rows: clients } = await Client.findAndCountAll({
      where: { isDeleted: false },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: {
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalClients: count,
          pageSize: parseInt(limit),
        },
        clients,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message,
    });
  }
};

// Get List of all Clinets
exports.getClientList = async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { isDeleted: 0 },
      attributes: ['id', 'name', 'email'],
    });
    return res.status(201).json({
      success: true,
      message: 'Client and user created successfully',
      data: clients,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error creating client and user',
      error: error.message,
    });
  }
}

// Get client by ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message,
    });
  }
};

// Update client by ID
exports.updateClient = async (req, res) => {
  const { id } = req.params;

  const { error } = clientUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const client = await Client.findOne({ where: { id } });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const existingUserWithEmail = await User.findOne({
      where: {
        email: req.body.email,
        clientId: { [Op.ne]: id },
      },
    });

    if (existingUserWithEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already associated with another user.',
      });
    }

    await Client.update(req.body, { where: { id } });

    const user = await User.findOne({ where: { clientId: id } });
    if (user) {
      const userDataToUpdate = { name: req.body.name, email: req.body.email };

      if (req.body.password) {
        userDataToUpdate.password = await bcrypt.hash(req.body.password, 10);
      }

      await User.update(userDataToUpdate, { where: { clientId: id } });
    }

    const updatedClient = await Client.findOne({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Client and associated user updated successfully',
      data: updatedClient,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating client and user',
      error: error.message,
    });
  }
};


//delete a client by ID
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findOne({ where: { id } });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    //delete the client
    client.isDeleted = true;
    await client.save();

    // Find and delete the associated user
    const user = await User.findOne({ where: { clientId: id } });
    if (user) {
      user.isDeleted = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Client and associated user deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting client and user',
      error: error.message,
    });
  }
};


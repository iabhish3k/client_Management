const { Client } = require('../models');
const User = require('../models/User');
const { userSchema, userUpdateSchema } = require('../validations/userValidation');
const bcrypt = require('bcrypt');


// Create a new user
exports.createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const { email, clientId } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already in use'
        });
    }

    // Check if clientId is required for admin role
    if (req.user?.userRole === 'admin' && !clientId) {
        return res.status(400).json({
            success: false,
            message: 'Client ID is required when creating a user as an Admin'
        });
    }

    try {
        // If the user is an admin, use the provided clientId; otherwise, use req.user.userId
        const user = await User.create({
            ...req.body,
            clientId: req.user?.userRole === 'admin' ? clientId : req.user.userId
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user.get({ plain: true, exclude: ['password', 'role'] })
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Determine the condition based on user role
    const whereCondition = req.user?.userRole === 'admin'
        ? { isDeleted: 0, role: 'user' }
        : { isDeleted: 0, role: 'user', clientId: req.user.userId };
    console.log("whereCondition", whereCondition)
    try {
        const { count: totalUsers, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            attributes: { exclude: ['password', 'role'] },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [{
                model: Client,
                attributes: ['name'], 
                required: false, 
            }],
        });

        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: {
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    pageSize: limit,
                },
                users,
            },
        });
    } catch (error) {
        console.log("Error in getAllUser--", error)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'role'] },
            where: { role: 'user' }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or not authorized'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    const { email, password } = req.body;

    try {
        // Find the user by ID
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use',
                });
            }
        }

        // If password is provided, hash it before updating
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }
        console.log("req.body-----", req.body)
        // Update the user with the provided data
        await user.update(req.body);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user.get({ plain: true, exclude: ['password', 'role'] }),
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { where: { role: 'user' } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        await user.update({ isDeleted: 1 });
        return res.status(200).json({
            success: true,
            message: 'User soft deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

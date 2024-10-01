const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const User = require('../models/User');

// Function to register a new user
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { userId: newUser.id, role: newUser.role }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: { error: error.message }
        });
    }
};

// Function to log in a user
const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, isDeleted: false } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                data: null
            });
        }

        const token = jwt.sign(
            {
                userId: user.role === 'client' ? user.clientId : user.id,
                userRole: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );


        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: { error: error.message }
        });
    }
};

// Exporting controller functions
module.exports = {
    register,
    login
};

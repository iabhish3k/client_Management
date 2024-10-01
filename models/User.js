// Import required modules
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255],
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Clients',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
    try {
        user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
});

module.exports = User;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApiRequests = sequelize.define('ApiRequests', {
    user_ip: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    request_method: {
        type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'),
        allowNull: false,
    },
    route: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    api_response_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    request_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
    },
    user_role: {
        type: DataTypes.STRING(50),
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'api_requests',
});

module.exports = ApiRequests;

const User = require('./User');
const Client = require('./Client');

// Define associations
User.belongsTo(Client, { foreignKey: 'clientId', targetKey: 'id' });

// Export models if needed
module.exports = {
    User,
    Client,
};

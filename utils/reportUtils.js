const { Op } = require('sequelize');
const ApiRequests = require('../models/ApiRequests');
const sequelize = require('../config/db');

// Helper function to get date ranges
const getDateRanges = () => {
  const today = new Date();
  return {
    today: new Date(today.setHours(0, 0, 0, 0)), 
    last7Days: new Date(today.setDate(today.getDate() - 7)), 
    thisMonth: new Date(today.getFullYear(), today.getMonth(), 1), 
  };
};

// Function to get counts for each category
const getCategoryCount = async (startDate) => {
  return await ApiRequests.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
      },
    },
    attributes: [
      'category',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['category'],
  });
};

module.exports = {
  getDateRanges,
  getCategoryCount,
};

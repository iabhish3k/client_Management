const { getDateRanges, getCategoryCount } = require("../utils/reportUtils");
const { Parser } = require('json2csv');
const sequelize = require('../config/db');
const { Op } = require('sequelize');
const ApiRequests = require("../models/ApiRequests");
// Exporting the MIS report function
exports.getMisReport = async (req, res) => {
  try {
    const dateRanges = getDateRanges();
    const reportData = {
      today: await getCategoryCount(dateRanges.today),
      last7Days: await getCategoryCount(dateRanges.last7Days),
      thisMonth: await getCategoryCount(dateRanges.thisMonth),
    };

    return res.status(200).json(reportData);
  } catch (error) {
    console.error('Error fetching MIS report:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.downloadMisReport = async (req, res) => {
    const { fromDate, toDate } = req.query;

    try {
        // Convert dates to Date objects or set defaults
        const startDate = fromDate ? new Date(fromDate) : new Date('1970-01-01'); 
        const endDate = toDate ? new Date(toDate) : new Date(); 
        endDate.setHours(23, 59, 59, 999);

        // Fetch records from the database within the date range
        const records = await ApiRequests.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            order: [['createdAt', 'DESC']],
            raw: true
        });

        if (records.length === 0) {
            return res.status(204).send();
        }

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(records);

        // Send the CSV file as a response
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=MISReport.csv");
        return res.status(200).end(csvData);
    } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

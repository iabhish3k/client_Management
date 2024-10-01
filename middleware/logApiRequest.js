const { getDateRanges, getCategoryCount } = require('../utils/reportUtils');
const ApiRequests = require('../models/ApiRequests');

const logApiRequest = async (req, res, next) => {
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let responseBody;

    const originalJson = res.json.bind(res);
    res.json = (body) => {
        responseBody = body;
        return originalJson(body);
    };

    res.on('finish', async () => {
        const userId = req.user ? req.user.userId : (responseBody && responseBody.data ? responseBody.data.userId : null);
        const userRole = req.user ? req.user.userRole : (responseBody && responseBody.data ? responseBody.data.role : null);
        const apiResponseStatus = getApiResponseStatus(res.statusCode, responseBody);
        const category = determineCategory(res.statusCode);

        try {
            await ApiRequests.create({
                user_ip: userIp,
                request_method: req.method,
                category,
                route: req.originalUrl,
                status_code: res.statusCode,
                api_response_status: apiResponseStatus,
                user_id: userId,
                user_role: userRole,
            });

            const io = req.app.get('io');
            if (io) {
                const reportData = await getUpdatedMisReport(req.app);
                io.emit('misReport', reportData);
            }
        } catch (error) {
            console.error('Error logging API request:', error);
        }
    });

    next();
};

const getApiResponseStatus = (statusCode, responseBody) => {
    if (statusCode >= 200 && statusCode < 300) {
        return responseBody && responseBody.message ? responseBody.message : 'success';
    } else if (statusCode >= 400 && statusCode < 500) {
        return responseBody && responseBody.message ? responseBody.message : 'client_error';
    } else if (statusCode >= 500) {
        return responseBody && responseBody.message ? responseBody.message : 'server_error';
    }
    return 'unknown';
};

const determineCategory = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
        return 'success';
    } else if (statusCode >= 400 && statusCode < 500) {
        return 'validation_fail';
    } else if (statusCode >= 500) {
        return 'server_error';
    }
    return 'unsuccessful';
};

const getUpdatedMisReport = async (app) => {
    const dateRanges = getDateRanges();
    return {
        today: await getCategoryCount(dateRanges.today),
        last7Days: await getCategoryCount(dateRanges.last7Days),
        thisMonth: await getCategoryCount(dateRanges.thisMonth),
    };
};

module.exports = logApiRequest;

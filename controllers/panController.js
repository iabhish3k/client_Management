const axios = require('axios');
const { panValidationSchema } = require('../validations/panValidation');



// Get PAN validation
exports.getPanValidation = async (req, res) => {
    const { error } = panValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message,
        });
    }

    const { pan } = req.body;

    try {
        const response = await axios.post('https://mvp.verify24x7.in/verifyApi/api/validate-pan', {
            pan,
        });

        console.error('Error during PAN validation:', response.data);
        return res.status(200).json({
            success: true,
            msg: 'Valid Pan Number with matching DOB.',
            data: response.data,
        });
    } catch (err) {
        if (err.response) {
            console.error('Response data:', err.response.data);
            return res.status(err.response.status).json({
                success: false,
                message: err.response.data.errorDetails || 'The provided PAN is invalid or does not exist.',
                error: 'PAN validation failed',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: err.message || 'An unexpected error occurred.',
            });
        }
    }

};

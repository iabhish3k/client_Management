const Joi = require('joi');

const panValidationSchema = Joi.object({
    pan: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
        .required()
        .messages({
            'string.pattern.base': 'PAN must be a valid 10-character alphanumeric string (e.g., ABCDE1234F)',
            'any.required': 'PAN is required',
        }),
});

module.exports = {
    panValidationSchema
};
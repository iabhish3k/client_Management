const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().optional(),
    clientId: Joi.number().integer().optional(),
});

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Export schemas
module.exports = {
    registerSchema,
    loginSchema,
};

const Joi = require("joi");

const clientSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required.",
        "any.required": "Name is required.",
    }),
    industry: Joi.string().required().messages({
        "string.empty": "Industry is required.",
        "any.required": "Industry is required.",
    }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(10)
        .required()
        .messages({
            "string.pattern.base":
                "Phone number must be 10 digits long and contain only numbers.",
            "string.length": "Phone number must be exactly 10 digits long.",
            "any.required": "Phone number is required.",
        }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).max(18).optional().messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must not exceed 18 characters.",
    }),
});

const clientUpdateSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required.",
        "any.required": "Name is required.",
    }),
    industry: Joi.string().required().messages({
        "string.empty": "Industry is required.",
        "any.required": "Industry is required.",
    }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(10)
        .required()
        .messages({
            "string.pattern.base":
                "Phone number must be 10 digits long and contain only numbers.",
            "string.length": "Phone number must be exactly 10 digits long.",
            "any.required": "Phone number is required.",
        }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).max(18).optional().messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must not exceed 18 characters.",
    }),
});

module.exports = {
    clientSchema,
    clientUpdateSchema,
};

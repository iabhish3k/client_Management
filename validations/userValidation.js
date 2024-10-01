const Joi = require('joi');


const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(18).required(),
    clientId: Joi.string().optional(),
});

const userUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(18).optional(),
    clientId: Joi.number().optional(),
});

module.exports = {
    userSchema,
    userUpdateSchema
};
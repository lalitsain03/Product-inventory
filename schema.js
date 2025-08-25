const Joi = require("joi");
module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    category: Joi.string().required(),
});
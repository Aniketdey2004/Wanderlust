const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});

module.exports.userSchema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','org'] } }).required(),
    password:Joi.string().required(),
    Phone:Joi.number().required(),
    About:Joi.string().required()
});
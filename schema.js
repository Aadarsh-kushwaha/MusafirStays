const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().uri().required()
    }).required()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  rating:Joi.number().required().min(1).max(5),
  Comment: Joi.string().required(),
  review: Joi.object({}).required()
})

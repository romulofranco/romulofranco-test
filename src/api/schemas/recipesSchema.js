const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

module.exports = joi.object({
  name: joi.string().required().max(100),
  ingredients: joi.string().required(),
  preparation: joi.string().required().max(255),
  userId: joi.objectId().required(),
});

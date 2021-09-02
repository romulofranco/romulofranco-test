const joi = require('joi');

module.exports = joi.object({
  email: joi.string().required().email().max(100),
  password: joi.string().required().max(100),
});

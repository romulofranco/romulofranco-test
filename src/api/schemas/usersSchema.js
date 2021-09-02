const joi = require('joi');

module.exports = joi.object({
  name: joi.string().required().max(100),
  email: joi.string().required().email().max(100),
  password: joi.string().required().max(100),
  role: joi.string().default('user').max(5),
});

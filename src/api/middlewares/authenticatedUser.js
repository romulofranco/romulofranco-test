const jwt = require('jsonwebtoken');
const { jwtData } = require('../config/auth');
const UserModel = require('../models/users');
const AppError = require('../errors/appError');

module.exports = async (request, _response, next) => {
  const token = request.headers.authorization;
  
  if (!token) throw new AppError('missing auth token', 401);

  try {
    const decodedVerified = jwt.verify(token, jwtData.secret);

    const user = await UserModel.findByEmail(decodedVerified.data.email);

    if (!user) { throw new AppError('jwt malformed', 401); }

    request.user = user;
    
    return next();
  } catch (err) {
    throw new AppError('jwt malformed', 401);
  }
};

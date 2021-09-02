const UserModel = require('../models/users');
const UserSchema = require('../schemas/usersSchema');
const UsersAdminSchema = require('../schemas/usersAdminSchema');
const AppError = require('../errors/appError');

const findAll = () => UserModel.findAll();

const findByEmail = async (email) => UserModel.findByEmail(email);

const create = async (user) => {
  const { value, error } = UserSchema.validate(user);
  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  const userEmail = await findByEmail(user.email);
  if (userEmail) {
      throw new AppError('Email already registered', 409);
  }

  return UserModel.create(value);
};

const createAdmin = async (user, roleAdmin) => {
  if (roleAdmin !== 'admin') throw new AppError('Only admins can register new admins', 403);
  
  const { value, error } = UsersAdminSchema.validate(user);
  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }
  
  const userEmail = await findByEmail(user.email);
  if (userEmail) {
      throw new AppError('Email already registered', 409);
  }

  return UserModel.create(value);
};

module.exports = {
  findAll,
  findByEmail,
  create,
  createAdmin,
};

const RecipeModel = require('../models/recipes');
const RecipeSchema = require('../schemas/recipesSchema');
const AppError = require('../errors/appError');

const findAll = () => RecipeModel.findAll();

const findById = (id) => RecipeModel.findById(id);

const findOwnerRecipe = async (id) => {
  const recipeData = await findById(id);

  return recipeData;
};

const remove = async (id, user, role) => {
  const response = await findOwnerRecipe(id);
  try {
    if (response.userId === user || role === 'admin') {
      return RecipeModel.removeById(id);
    }
   
    throw new AppError('Invalid data. Permission denied to remove', 400);
  } catch (error) {
    throw new AppError('Invalid data. Permission denied to remove', 400);
  }
};

const create = async (recipe) => {
  const { value, error } = RecipeSchema.validate(recipe);
  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  return RecipeModel.create(value);
};

const edit = async (id, recipe, role) => {
  const { error } = RecipeSchema.validate(recipe);

  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  const response = await findOwnerRecipe(id);

  if (response.userId === recipe.userId || role === 'admin') {
    return RecipeModel.edit(id, recipe);
  }
  throw new AppError('Invalid data. Permission denied to edit', 400);
};

const createImage = async (id, image, user, role) => {
  const response = await findOwnerRecipe(id);
  if (response.userId === user || role === 'admin') {
    return RecipeModel.createImage(id, image, user);
  }
  throw new AppError('Invalid data. Permission denied to edit', 400);
};

module.exports = {
  findAll,
  findById,
  findOwnerRecipe,
  create,
  edit,
  remove,
  createImage,
};

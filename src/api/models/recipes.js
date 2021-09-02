const { ObjectId } = require('mongodb');
const { connection } = require('./conn');

const getRecipesCollection = async () => {
  const conn = await connection();
  return conn.collection('recipes');
};

const findAll = async () => {
  const recipes = await getRecipesCollection();
  return recipes.find().toArray();
};

const findById = async (id) => {
  const recipe = await getRecipesCollection();
  try {
    return recipe.findOne(ObjectId(id));
  } catch (err) {
    return false;
  } 
};

const create = async (recipe) => {
  const recipes = await getRecipesCollection();

  const { recipeId } = await recipes.insertOne(recipe);
  return { _id: recipeId, ...recipe };
};

const edit = async (id, recipe) => {
  const recipes = await getRecipesCollection();

  const updatedRecipe = await recipes.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: recipe },
    { returnOriginal: false },
  );
  return updatedRecipe.value;
};

const createImage = async (id, image, user) => {
  const recipes = await getRecipesCollection();

  const updatedRecipeImage = await recipes.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: {
      image,
      userId: user,
    } },
    { returnOriginal: false },
  );
  
  return updatedRecipeImage.value;
};

const removeById = async (id) => {
  const recipes = await getRecipesCollection();
  const { deletedCount } = await recipes.deleteOne({ _id: ObjectId(id) });
  if (!deletedCount) throw new Error('Failed to remove register');
  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  edit,
  createImage,
  removeById,
};

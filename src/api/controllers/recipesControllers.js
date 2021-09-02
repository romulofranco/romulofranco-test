const recipesServices = require('../services/recipesService');

const findAll = (async (_request, response) => {
    const results = await recipesServices.findAll();
    response.json(results);
});

const findById = (async (request, response) => {
    const { id } = request.params; 
   
    const result = await recipesServices.findById(id);

    if (!result) {
        response.status(404).json({ message: 'recipe not found' });
    } else {
        response.json(result);
    }
});

const create = (async (request, response) => {
    const { name, ingredients, preparation } = request.body;
    const { _id: user } = request.user;

    const { _id, ...recipe } = await recipesServices.create({
        name, ingredients, preparation, userId: user.toString(),
    });

    response.status(201).json({
        recipe: {
            name: recipe.name,
            ingredients: recipe.ingredients,
            preparation: recipe.preparation,
            userId: recipe.userId,
            _id,
        },
    });
});

const edit = (async (request, response) => {
    const { id } = request.params;
    const { _id: user, role } = request.user;

    request.body.userId = user.toString();
    const results = await recipesServices.edit(id, request.body, role);
    response.json(results);
});

const createImage = (async (request, response) => {
    const { id } = request.params;
    const image = request.file ? request.file.filename : undefined;
    const { _id: user, role } = request.user;

    const fullUrl = `${request.get('host')}/src/uploads/${image}`;
    
    const results = await recipesServices.createImage(id, fullUrl, user.toString(), role);
    response.json(results);
});

const remove = (async (request, response) => {
    const { id } = request.params;
    const { _id: user, role } = request.user;

    await recipesServices.remove(id, user.toString(), role);

    response.status(204).json({});
});

module.exports = {
    findAll,
    findById,
    create,
    edit,
    createImage,
    remove,
};

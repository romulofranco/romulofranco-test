const UsersServices = require('../services/usersService');

const findAll = (async (_request, response) => {
    const results = await UsersServices.findAll();
    response.json(results);
});

const create = (async (request, response) => {
    const { name, email, password } = request.body;
    const { _id, ...user } = await UsersServices.create({
        name, email, password,
    });

    response.status(201).json({ user: {
        name: user.name,
        email: user.email,
        role: user.role,
        _id,
    } });
});

const createAdmin = (async (request, response) => {
    const userData = request.body;
    const { role: roleAdmin } = request.user;

    const { _id, ...user } = await UsersServices.createAdmin(
        userData, roleAdmin,
    );

    response.status(201).json({ user: {
        name: user.name,
        email: user.email,
        role: user.role,
        _id,
    } });
});

module.exports = {
    findAll,  
    create,
    createAdmin,
};

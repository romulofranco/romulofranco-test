const express = require('express');
const users = require('./users.routes');
const login = require('./login.routes');
const recipes = require('./recipes.routes');

const router = express.Router();

router.use('/users', users);
router.use('/login', login);
router.use('/recipes', recipes);

module.exports = router;

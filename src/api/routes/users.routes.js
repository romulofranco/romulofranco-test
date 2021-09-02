const express = require('express');

const router = express.Router();
const usersControllers = require('../controllers/usersController');
const authenticatedUser = require('../middlewares/authenticatedUser');

router.get('/', usersControllers.findAll);
router.post('/', usersControllers.create);
router.post('/admin', authenticatedUser, usersControllers.createAdmin);

module.exports = router;

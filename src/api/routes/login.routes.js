const express = require('express');

const router = express.Router();
const LoginControllers = require('../controllers/loginController');

router.post('/', LoginControllers.login);

module.exports = router;

const express = require('express');
const multer = require('multer');
const uploadConfig = require('../config/multer');
const authenticatedUser = require('../middlewares/authenticatedUser');

const router = express.Router();
const upload = multer(uploadConfig);
const RecipesControllers = require('../controllers/recipesControllers');

router.get('/', RecipesControllers.findAll);
router.get('/:id', RecipesControllers.findById);

router.post('/', authenticatedUser, RecipesControllers.create);

router.put('/:id', authenticatedUser, RecipesControllers.edit);
router.put('/:id/image', authenticatedUser, upload.single('image'), RecipesControllers.createImage);

router.delete('/:id', authenticatedUser, RecipesControllers.remove);

module.exports = router;

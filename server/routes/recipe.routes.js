const Router = require('express')
const recipeController = require('../controllers/recipeController')

const router = new Router()

router.get('/recipes', recipeController.getAllRecipes)
router.get('/random', recipeController.getRandomRecipe)
router.get('/recipe/:id', recipeController.getRecipe)
router.get('/search', recipeController.getRecipesByIngredients)

module.exports = router

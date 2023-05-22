const Router = require('express')
const recipeController = require('../controllers/recipeController')
const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()

router.get('/recipes', recipeController.getAllRecipes)
router.get('/random', recipeController.getRandomRecipe)
router.get('/recipe/:id', recipeController.getRecipe)
router.get('/search', recipeController.getRecipesByIngredients)
router.post('/add-recipe', authMiddleware, recipeController.createRecipe)
router.delete('/delete-recipe/:id', authMiddleware, recipeController.deleteRecipe)
router.patch('/change-recipe/:id', authMiddleware, recipeController.changeRecipe)

module.exports = router

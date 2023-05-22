const Router = require('express')
const recipeController = require('../controllers/recipeController')
const authMiddleware = require('../middleware/auth.middleware')

const Ingredient = require('../models/Ingredient')
const Tag = require('../models/Tag')

const router = new Router()

router.get('/recipes', recipeController.getAllRecipes)
router.get('/random', recipeController.getRandomRecipe)
router.get('/recipe/:id', recipeController.getRecipe)
router.get('/search', recipeController.getRecipesByIngredients)
router.post('/add-recipe', authMiddleware, recipeController.createRecipe)
router.delete('/delete-recipe/:id', authMiddleware, recipeController.deleteRecipe)
router.patch('/change-recipe/:id', authMiddleware, recipeController.changeRecipe)

router.get('/add-tags', async (req,res) => {
  try {
    const ingredients = await Ingredient.find()

    for (let i = 0; i < ingredients.length; i++) {
      let tags = ''

      if (ingredients[i].name.indexOf(' ') !== -1 && ingredients[i].name.indexOf('(') === -1) {
        tags = ingredients[i].name.split(' ')
      } else if (ingredients[i].name.indexOf('-') !== -1) {
        tags = ingredients[i].name.split('-')
      } else if (ingredients[i].name.indexOf('(') !== -1) {
        tags = ingredients[i].name.replace(/[()]/g, '').split(' ')
      } else {
        tags = ingredients[i].name.split()
      }

      console.log(tags)
      // for (let tag of tags) {
      //   const isNew = await Tag.findOne({ name: tag })
      //
      //   if (isNew === null) {
      //     const newTag = new Tag({
      //       name: tag
      //     })
      //
      //     await newTag.save()
      //   }
      // }

      const newTags = await Tag.find({ name: {$in: tags} })

      // console.log(newTags)



      const res = newTags.map(item => item.id)

      ingredients[i].tags = res

      await ingredients[i].save()
    }

    return res.send({
      mes: 'work'
    })
  } catch (e) {
    console.log(e.message)
    res.send({
      message: 'Server Error'
    })
  }
})

module.exports = router


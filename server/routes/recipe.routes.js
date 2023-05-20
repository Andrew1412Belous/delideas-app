const Router = require('express')
const recipeController = require('../controllers/recipeController')

const Ingredient = require('../models/Ingredient')
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')

const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()

router.get('/recipes', recipeController.getAllRecipes)
router.get('/random', recipeController.getRandomRecipe)
router.get('/recipe/:id', recipeController.getRecipe)
router.get('/search', recipeController.getRecipesByIngredients)
router.post('/add-recipe', authMiddleware, recipeController.createRecipe)

router.post('/products', async (req, res) => {
  try {
    const check = req.body.category

    const products = await Ingredient.find({ name: {$in: req.body.ingredients} })

    const category = await Category.findOne({ label: check })

    console.log(category)

    console.log(products.map(item => item.id))

    return res.json(products)
  } catch (e) {
    return res.status(400).send({ message: 'Server error' })
  }
})

router.post('/create', async (req, res) => {
  try {
    const products = await Ingredient.find({ name: {$in: req.body.ingredients} })

    const ingredients = products.map(item => item.id)

    console.log(ingredients)

    const category = await Category.findOne({ label: req.body.category })

    console.log(category._id)

    // const test = await Recipe.findById(req.body.id)

    // if (test === null) {
      const recipe = new Recipe({
        title: req.body.title,
        ingredients,
        category: category._id,
        times: req.body.times,
        image: req.body.image,
        instructions: req.body.instructions
      })

    console.log(recipe)
    //
      await recipe.save()

      return res.send({
        message: 'WORK',
        recipe
      })
  } catch (e) {
    return res.status(400).send({ message: 'Server error' })
  }
})

router.post('/add', async (req, res) => {
  try {
    const { products } = req.body

    for (let product of products) {
      const ingr = await Ingredient.findOne({ name: product })

      if (ingr === null) {
        const ingredient = await new Ingredient({
          name: product
        })

        await ingredient.save()
      }
    }

    return res.send({
      message: 'WORk'
    })
  } catch (e) {
    return res.status(400).send({ message: 'Server error' })
  }
})

router.get('/edit/products', async (req, res) => {
  try {
    const products = await Ingredient.find()

    const result = products.map(item => item.name)

    console.log(result)

    for (let i = 0; i < result.length; i++) {
      if (!products[i].tags.length) {
        if (result[i].indexOf(' ') !== -1 && result[i].indexOf('(') === -1) {
          const tags = result[i].split(' ')

          console.log(tags)
          products[i].tags = tags

          await products[i].save()
        } else if (result[i].indexOf('-') !== -1) {
          const tags = result[i].split('-')

          console.log(tags)
          products[i].tags = tags

          await products[i].save()
        } else if (result[i].indexOf('(') !== -1) {
          const tags = result[i].replace(/[()]/g, '').split(' ')

          console.log(tags)
          products[i].tags = tags

          await products[i].save()
        } else {
          const tags = result[i].split()

          console.log(tags)
          products[i].tags = tags

          await products[i].save()
        }
      }
    }

    return res.send({
      mes: 'WORK'
    })
  } catch (e) {
    return res.status(400).send({ message: 'Server error' })
  }
})

module.exports = router


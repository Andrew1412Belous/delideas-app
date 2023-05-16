const Recipe = require('../models/Recipe')

class RecipeController {
  async getAllRecipes (req, res) {
    try {
      const offset = parseInt(req.query.offset)
      const limit = parseInt(req.query.limit)

      const recipes = await Recipe.find()

      console.log(offset)
      console.log(limit)

      const sliceCount = recipes.length >= (limit)
        ? limit
        : recipes.length

      console.log(sliceCount)

      return res.json(recipes.slice(offset, sliceCount))
    } catch (e) {
      console.log(e.message)
      res.send({ message: 'Server error' })
    }
  }

  async getRandomRecipe (req, res) {
    try {
      const recipes = await Recipe.find()

      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

      return randomRecipe
        ? res.json(randomRecipe)
        : res.status(400).json({
          message: 'Invalid recipe id'
        })
    } catch (e) {
      console.log(e.message)
      res.send({ message: 'Server error' })
    }
  }

  async getRecipe (req, res) {
    try {
      const { id } = req.params

      const recipe = await Recipe.findOne({ id })

      return recipe
        ? res.json(recipe)
        : res.status(400).json({
          message: "Error, invalid recipe"
        })
    } catch (e) {
      console.log(e.message)
      res.send({ message: 'Server error' })
    }
  }

  async getRecipesByIngredients (req, res) {
    try {
      const ingredients = req.query.ingredients.split(',')

      const recipes = await Recipe.find()

      const result = []

      for (let i = 0; i < recipes.length; i++) {
        const isFound = recipes[i].ingredients
          .some(ingredient => ingredients
            .some(product => ingredient.indexOf(product) !== -1))

        if (isFound) {
          result.push(recipes[i])
        }
      }

      return res.json(result)
    } catch (e) {
      console.log(e.message)
      res.send({ message: 'Server error' })
    }
  }
}

module.exports = new RecipeController()

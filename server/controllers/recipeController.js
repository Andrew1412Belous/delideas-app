const Recipe = require('../models/Recipe')
const Ingredient = require('../models/Ingredient')
const Category = require('../models/Category')

class RecipeController {
  async getAllRecipes (req, res) {
    try {
      const offset = parseInt(req.query.offset)
      const limit = parseInt(req.query.limit)

      const recipes = await Recipe.find()

      const sliceCount = recipes.length >= (limit)
        ? limit
        : recipes.length

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

      const recipe = await Recipe.findById(id)

      const ingredients = await Ingredient.find({ _id: {$in: recipe.ingredients} })
      const category = await Category.findById(recipe.category)

      return recipe
        ? res.json({
          _id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          times: recipe.times,
          instructions: recipe.instructions,
          category: category.label,
          ingredients: ingredients.map(item => item.name)
        })
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
      const products = req.query.ingredients.split(',').join(' ').split(' ')

      const ingredients = await Ingredient.find({ tags: {$in: products }})

      const recipes = await Recipe.find({ ingredients: {$in: ingredients.map(item => item.id)} })

      const result = []

      for (let i = 0; i < recipes.length; i++) {
        const ingredients = await Ingredient.find({ _id: {$in: recipes[i].ingredients }})
        const category = await Category.findById(recipes[i].category)

        result.push({
          title: recipes[i].title,
          image: recipes[i].image,
          id: recipes[i]._id,
          category,
          instructions: recipes[i].instructions,
          times: recipes[i].times,
          ingredients: ingredients.map(item => item.name)
        })
      }

      return res.json(result)
    }
     catch (e) {
      console.log(e.message)
      res.send({ message: 'Server error' })
    }
  }
}

module.exports = new RecipeController()

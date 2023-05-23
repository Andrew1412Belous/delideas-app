const Recipe = require('../models/Recipe')
const Ingredient = require('../models/Ingredient')
const Category = require('../models/Category')
const User = require('../models/User')
const Tag = require('../models/Tag')

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
      const { id } = req.query

      const recipes = await Recipe.find()

      const randomIndex = () => Math.floor(Math.random() * recipes.length)

      let randomRecipe = recipes[randomIndex()]

      while (randomRecipe.id.toString() === id) {
        randomRecipe = recipes[randomIndex()]
      }

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

      const tags = await Tag.find({ name: {$in: products }})

      const ingredients = await Ingredient.find({ tags: {$in: tags.map(item => item.id) }})

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

  async createRecipe (req, res) {
    try {
      const user = await User.findById(req.user.id)

      if (user.role === 'admin') {
        const recipe = req.body

        const isNew = await Recipe.findOne({ title: req.body.title })

        if (isNew === null) {
          for (let i = 0; i < req.body.ingredients.length; i++) {
            const ingredient = await Ingredient.findOne({ name: req.body.ingredients[i] })

            if (ingredient === null) {
              let tags = ''

              if (req.body.ingredients[i].indexOf(' ') !== -1 && req.body.ingredients[i].indexOf('(') === -1) {
                tags = req.body.ingredients[i].split(' ')
              } else if (req.body.ingredients[i].indexOf('-') !== -1) {
                tags = req.body.ingredients[i].split('-')
              } else if (req.body.ingredients[i].indexOf('(') !== -1) {
                tags = req.body.ingredients[i].replace(/[()]/g, '').split(' ')
              } else {
                tags = req.body.ingredients[i].split()
              }

              for (let tag of tags) {
                const isNewTag = await Tag.findOne({ name: tag })

                if (isNewTag === null) {
                  const newTag = new Tag({
                    name: tag
                  })

                  await newTag.save()
                }
              }

              const newTags = await Tag.find({ name: {$in: tags} })

              const res = newTags.map(item => item.id)

              const newIngredient = new Ingredient({
                name: req.body.ingredients[i],
                tags: res
              })

              await newIngredient.save()
            }
          }

          const ingredients = await Ingredient.find({ name: {$in: recipe.ingredients} })
          const category = await Category.findOne({ name: recipe.category })

          const newRecipe = new Recipe({
            title: recipe.title,
            times: recipe.times,
            instructions: recipe.instructions,
            ingredients: ingredients.map(item => item.id),
            image: recipe.image,
            category: category.id,
          })

          await newRecipe.save()

          return res.send({
            message: 'Рецепт створено'
          })
        } else {
          return res.status(400).send({ message: 'Такий рецепт вже є' })
        }
      } else {
        return res.status(400).send({ message: 'Not access' })
      }
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }

  async deleteRecipe (req, res) {
    try {
      const user = await User.findById(req.user.id)

      if (user.role === 'admin') {
        const { id } = req.params

        await Recipe.findByIdAndDelete(id)

        return res.send({
          message: 'Рецепт видалено'
        })
      }
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }

  async changeRecipe (req, res) {
    try {
      const user = await User.findById(req.user.id)

      if (user.role === 'admin') {
        const { id } = req.params

        const isNew = await Recipe.findOne({ title: req.body.title })

        if (isNew === null) {
          for (let i = 0; i < req.body.ingredients.length; i++) {
            const ingredient = await Ingredient.findOne({ name: req.body.ingredients[i] })

            if (ingredient === null) {
              let tags = ''

              if (req.body.ingredients[i].indexOf(' ') !== -1 && req.body.ingredients[i].indexOf('(') === -1) {
                tags = req.body.ingredients[i].split(' ')
              } else if (req.body.ingredients[i].indexOf('-') !== -1) {
                tags = req.body.ingredients[i].split('-')
              } else if (req.body.ingredients[i].indexOf('(') !== -1) {
                tags = req.body.ingredients[i].replace(/[()]/g, '').split(' ')
              } else {
                tags = req.body.ingredients[i].split()
              }


              for (let tag of tags) {
                const isNewTag = await Tag.findOne({ name: tag })

                if (isNewTag === null) {
                  const newTag = new Tag({
                    name: tag
                  })

                  await newTag.save()
                }
              }

              const newTags = await Tag.find({ name: {$in: tags} })

              const res = newTags.map(item => item.id)

              const newIngredient = new Ingredient({
                name: req.body.ingredients[i],
                tags: res
              })

              await newIngredient.save()
            }
          }

          const ingredients = await Ingredient.find({ name: {$in: req.body.ingredients} })
          const category = await Category.findOne({ name: req.body.category })

          const recipe = await Recipe.findById(id)

          recipe.title = req.body.title
          recipe.times = req.body.times
          recipe.instructions =  req.body.instructions
          recipe.ingredients = ingredients.map(item => item.id)
          recipe.image =  req.body.image
          recipe.category = category.id

          await recipe.save()

          return res.send({
            message: "Рецепт змінено"
          })
        } else {
          return res.status(400).send({ message: 'Рецепт з даною назвою вже є' })
        }
      }

      return res.send({
        message: 'Рецепт змінено'
      })
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }
}


module.exports = new RecipeController()

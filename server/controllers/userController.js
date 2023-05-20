const Recipe = require('../models/Recipe')
const config = require('config')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController {
  async registration (req, res) {
      try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
          return res.status(404).json({ message: 'Incorrect request', errors })
        }

        const { email, password } = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
          return res.status(400).json({
            message: `User with email ${email} already exist`
          })
        }

        const hashPassword = await bcrypt.hash(password, 8)

        const user = new User({
          email,
          password: hashPassword,
          role: 'admin'
        })

        await user.save()

        return res.json({
          user: {
            email: user.email,
            avatar: user.avatar,
            favorites: user.favorites,
            role: user.role,
          },
          message: 'User was created'
        })
      } catch (e) {
        console.log(e.message)
        res.send({
          message: 'Server Error'
        })
      }
  }

  async login (req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      const isPassValid = bcrypt.compareSync(password, user.password)

      if (!isPassValid) {
        return res.status(400).send({ message: 'Invalid password' })
      }

      const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })

      return res.json({
        token,
        user: {
          email: user.email,
          avatar: user.avatar,
          favorites: user.favorites,
          role: user.role,
        }
      })
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }

  async auth (req, res) {
    try {
      const user = await User.findById(req.user.id)

      const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })

      return res.json({
        token,
        user: {
          email: user.email,
          avatar: user.avatar,
          favorites: user.favorites,
          role: user.role,
        }
      })
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }

  async updateFavorites (req, res) {
    try {
      const recipeId = req.body.recipeId

      const user = await User.findById(req.user.id)

      if (user.favorites.includes(recipeId)) {
        user.favorites = user.favorites.filter(item => item.toString() !== recipeId)
      } else {
        const recipe = await Recipe.findById(recipeId)

        if (recipe) {
          user.favorites.push(recipeId)
        } else {
          res.status(401).send({ message: 'Invalid recipe id' })
        }
      }

      await user.save()

      return res.json(user)
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }

  async getAllFavorites (req, res) {
    try {
      const user = await User.findById(req.user.id)
      const recipes = await Recipe.find({ _id: {$in: user.favorites} })

      return res.json(recipes)
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  }
}

module.exports = new UserController()

const Router = require('express')
const User = require('../models/User')
const Recipe = require('../models/Recipe')
const bcrypt = require('bcryptjs')
const config = require('config')
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')

const { check, validationResult } = require('express-validator')
const {ObjectId} = require('mongodb')

const router = new Router()

router.post('/registration',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({
      min: 3,
      max: 12
    })
  ],
  async (req, res) => {
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
      id: v4()
    })

    await user.save()

    return res.json({
      message: 'User was created'
    })
  } catch (e) {
    console.log(e.message)
    res.send({
      message: 'Server Error'
    })
  }
})

router.post('/login', async (req, res) => {
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
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          favorites: user.favorites
        }
      })
    } catch (e) {
      console.log(e.message)
      res.send({
        message: 'Server Error'
      })
    }
  })

router.get('/auth', authMiddleware,
  async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id })

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        favorites: user.favorites
      }
    })
  } catch (e) {
    console.log(e.message)
    res.send({
      message: 'Server Error'
    })
  }
})

router.patch('/update', async (req, res) => {
  try {
    const { id } = req.body
    const recipeId = parseInt(req.body.recipeId)

    const user = await User.findOne({ id })

    if (user.favorites.includes(recipeId)) {
      user.favorites = user.favorites.filter(item => item !== recipeId)
    } else {
      const recipe = await Recipe.findOne({ id: recipeId })

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
})

router.get('/favorites', async (req, res) => {
  try {
    const { id } = req.query

    const user = await User.findOne({ id })
    const recipes = await Recipe.find({ id: {$in: user.favorites} })

    return res.json(recipes)
  } catch (e) {
    console.log(e.message)
    res.send({
      message: 'Server Error'
    })
  }
})

module.exports = router

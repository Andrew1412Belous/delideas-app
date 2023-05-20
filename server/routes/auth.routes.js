const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const userController = require('../controllers/userController')
const { check } = require('express-validator')

const router = new Router()

router.post('/registration',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({
      min: 3,
      max: 12
    })
  ], userController.registration)

router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.auth)
router.patch('/update', authMiddleware, userController.updateFavorites)
router.get('/favorites', authMiddleware, userController.getAllFavorites)

module.exports = router

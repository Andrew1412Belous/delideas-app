const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')

router.post('/avatar', authMiddleware, fileController.uploadAvatar)

module.exports = router

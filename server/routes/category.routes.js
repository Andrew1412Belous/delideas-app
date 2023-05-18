const Router = require('express')
const router = new Router()
const Category = require('../models/Category')

router.get('/', async (req,res) => {
  try {
    const categories = await Category.find()

    return res.json(categories)
  } catch (e) {
    console.log(e.message)
    res.send({
      message: 'Server Error'
    })
  }
})

module.exports = router


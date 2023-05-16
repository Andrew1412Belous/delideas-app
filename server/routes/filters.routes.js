const Router = require('express')
const Filter = require('../models/Filter')

const router = new Router()

router.get('/', async (req, res) => {
  try {
    const filters = await Filter.find()

    return res.json(filters)
  } catch (e) {
    console.log(e.message)
    res.send({ message: 'Server error' })
  }
})

module.exports = router

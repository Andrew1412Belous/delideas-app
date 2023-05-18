const { Schema, model } = require('mongoose')

const Ingredient = new Schema({
  name: { type: String, required: true, unique: true },
  tags: [{ type: String }]
})

module.exports = model('Ingredient', Ingredient)

const { Schema, model, ObjectId } = require('mongoose')

const Ingredient = new Schema({
  name: { type: String, required: true, unique: true },
  tags: [{ type: ObjectId }]
})

module.exports = model('Ingredient', Ingredient)

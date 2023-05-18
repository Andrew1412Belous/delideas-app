const { Schema, model, ObjectId } = require('mongoose')

const Recipe  = new Schema({
  title: { type: String, required: true, unique: true },
  ingredients: [{ type: ObjectId, ref: 'Ingredient' ,required: true }],
  instructions: [{ type: String, required: true, unique: false }],
  times: { type: String, required: true, unique: false },
  image: { type: String, required: true, unique: true },
  category: { type: ObjectId, ref: 'Category' }
})

module.exports = model('Recipe', Recipe)

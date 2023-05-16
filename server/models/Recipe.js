const { Schema, model } = require('mongoose')

const Recipe  = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  ingredients: [{ type: String, required: true, unique: false }],
  instructions: [{ type: Object, required: true, unique: false }],
  times: { type: Object, required: true, unique: false },
  image: { type: String, required: true, unique: true }
})

module.exports = model('Recipe', Recipe)

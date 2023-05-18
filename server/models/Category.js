const { Schema, model } = require('mongoose')

const Category = new Schema({
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true }
})

module.exports = model('Category', Category)

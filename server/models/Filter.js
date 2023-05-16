const { Schema, model } = require('mongoose')

const Filter = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  label: { type: String, required: false, unique: false }
})

module.exports = model('Filter', Filter)

const { Schema, model } = require('mongoose')

const Tag = new Schema({
  name: { type: String, unique: true },
})

module.exports = model('Tag', Tag)

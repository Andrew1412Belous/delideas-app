const { Schema, model } = require('mongoose')
const {ObjectId} = require('mongodb')

const User = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  favorites: [{ type: ObjectId, ref: 'Recipe' }]
})

module.exports = model('User', User)

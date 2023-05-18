const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  favorites: [{ type: ObjectId, ref: 'Recipe' }],
})

module.exports = model('User', User)

const { Schema, model } = require('mongoose')
const { ObjectId}  = require('mongodb')

const Sample = new Schema({
  products: [{ type: ObjectId }]
})

module.exports = model('Sample', Sample)

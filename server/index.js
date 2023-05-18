const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const fileUpload = require('express-fileupload')

const recipeRouter = require('./routes/recipe.routes')
const categoryRouter = require('./routes/category.routes')
const authRouter = require('./routes/auth.routes')
const fileRouter = require('./routes/file.routes')

const app = express()
const PORT = config.get('serverPort')

const corsMiddleware = require('./middleware/cors.middleware')

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static('static'))
app.use('/auth', authRouter)
app.use('/files', fileRouter)
app.use('/categories', categoryRouter)
app.use('/', recipeRouter)

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'))

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (e) {
    console.log(e.message)
  }
}

start()

const express = require("express")
const mongoose = require("mongoose")
const config = require("config")

const recipeRouter = require('./routes/recipe.routes')
const filterRouter = require('./routes/filters.routes')
const authRouter = require('./routes/auth.routes')

const app = express()
const PORT = config.get('serverPort')

const corsMiddleware = require('./middleware/cors.middleware')

app.use(corsMiddleware)
app.use(express.json())
app.use('/auth', authRouter)
app.use('/filters', filterRouter)
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

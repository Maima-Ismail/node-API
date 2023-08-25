const mongoose = require('mongoose')

mongoose
  .connect(
    'mongodb+srv://maimamirza:admin@cluster0.ggjwj3g.mongodb.net/NODE-API?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(error)
  })

const db = mongoose.connection

module.exports = db

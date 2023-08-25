const express = require('express')
const session = require('express-session')
const cors = require('cors')
const router = require('./router')
const bcrypt = require('bcrypt')
const path = require('path')
const User = require('./Models/userModel')
const db = require('./db')
const app = express()

app.use(cors())
app.use(
  session({
    secret: 'MYsecret',
    resave: false,
    saveUninitialized: true,
  })
)

// app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)

app.post('/signup', async (req, res) => {
  const { userName, userEmail, userPassword } = req.body
  const hashedPass = await bcrypt.hash(userPassword, 10)
  try {
    const newUser = await User.create({
      userName,
      userEmail,
      userPassword: hashedPass,
    })
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message })
  }
})

app.post('/login', async (req, res) => {
  const { userEmail, userPassword } = req.body
  try {
    const user = await User.findOne({ userEmail })
    if (!user) {
      res.status(401).json({ message: 'Email does not exist' })
      return
    }
    const passValid = await bcrypt.compare(userPassword, user.userPassword)
    if (!passValid) {
      res.status(401).json({ message: 'Invalid Password' })
      return
    }
    req.session.user = user
    res.status(200).json({ message: 'Logged in successfully', user: user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error in signing in', error: error.message })
  }
})

app.post('/logout', async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res
        .status(500)
        .json({ message: 'Error logging out', error: error.message })
    } else {
      res.status(200).json({ message: 'Signed out successfully' })
    }
  })
})

const port = 3003
app.listen(port, () => {
  console.log('Authentication server running')
})

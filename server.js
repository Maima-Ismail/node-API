const express = require('express')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const app = express()
const router = require('./router')
const bcrypt = require('bcrypt')
const db = require('./db')
const User = require('./Models/userModel')
const Student = require('./Models/studentModel')

const port = 5000
app.use(express.static(path.join(__dirname, './demo-project/dist')))
app.get('*', function (_, res) {
  res.sendFile(
    path.join(__dirname, './demo-project/dist/index.html'),
    function (err) {
      res.status(500).send(err)
    }
  )
})

app.use(cors())
app.use(
  session({
    secret: 'MYsecret',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)

//routes student

app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body)
    res.status(200).json(student)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
})

app.get('/students', async (req, res) => {
  try {
    const student = await Student.find({}).sort({ albumId: 1 })
    res.status(200).json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params
    const student = await Student.findById(id)
    res.status(200).json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params
    const student = await Student.findByIdAndUpdate(id, req.body)
    if (!student) {
      res.status(404).json({ message: 'cannot find object with id ${id}' })
    }
    const updatedStudent = await Student.findById(student)
    res.status(200).json(updatedStudent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params
    const student = await Student.findByIdAndDelete(id, req.body)
    if (!student) {
      res.status(404).json({ message: 'cannot find object with id ${id}' })
    }
    res.status(200).json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//routes user
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

app.listen(port, () => {
  console.log('Server Running')
})

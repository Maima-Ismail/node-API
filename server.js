const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./db')
const Student = require('./Models/studentModel')

const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.get('/', (req, res) => {
  res.send('Hello Node API')
})

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

app.listen(port, () => {
  console.log('Server Running')
})

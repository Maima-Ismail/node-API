const express = require('express')
const router = express.Router()
const db = require('./db')
const cors = require('cors')
const User = require('./Models/userModel')

router.use(cors())

router.post('/firebase-callback', async (req, res) => {
  console.log('req.body', req.body)
  try {
    const { uid, userName, userEmail, userPassword } = req.body
    // const userData = {
    //   userName: displayName,
    //   userEmail: email,
    //   userPassword: null,
    //   uid: uid,
    // }
    // console.log('uid:', uid) // Add this line
    // console.log('email:', email) // Add this line
    // console.log('displayName:', displayName) // Add this line
    // console.log(userData)

    const existingUser = await User.findOne({
      $or: [{ uid }, { userEmail }],
    })
    if (!existingUser) {
      console.log('user not found')
      const newUser = await User.create(req.body)
      console.log('new', newUser)
      res.status(200).json({ message: 'user not exist', user: newUser })
    } else {
      console.log('existing user:', existingUser)
      existingUser.userName = displayName
      await existingUser.save()
      res
        .status(200)
        .json({ message: 'data updated successfully', user: existingUser })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error syncing user data', error: error.message })
  }
})

module.exports = router

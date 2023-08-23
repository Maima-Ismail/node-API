const mongoose = require('mongoose')
const studentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    albumId: {
      type: Number,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Student = mongoose.model('Student', studentSchema)
module.exports = Student

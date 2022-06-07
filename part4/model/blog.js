const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: []
})

blogSchema.set("toJSON", {
  transform: (document, response) => {
    response.id = response._id.toString()
    delete response._id
    delete response.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
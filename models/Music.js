const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  description: {
    type: String,
    required: true
  },
  audioFile: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Music', musicSchema)
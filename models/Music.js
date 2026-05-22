const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  artist:      { type: String, required: true },
  album:       { type: String, required: true },
  genre:       { type: String, required: true },
  year:        { type: Number, required: true },
  duration:    { type: String, required: true },
  rating:      { type: Number, min: 1, max: 10 },
  description: { type: String, required: true },
  audioFile:   { type: String, required: false },
  mood:        { type: String, default: '' },        // melancholic | upbeat | intense | chill | contemplative | powerful
  energy:      { type: Number, min: 1, max: 10, default: 5 }, // 1=calm … 10=chaos
  tags:        { type: [String], default: [] },      // e.g. ['live','punjabi','anthem']
  isLive:      { type: Boolean, default: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Music', musicSchema)
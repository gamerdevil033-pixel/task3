let mongoose = require('mongoose')

const concertSchema = new mongoose.Schema({
  type: String,
  title: String,
  duration: String,
  genre: Array,
  Artist: String,
  plot: String,
  language: Array,
  country: String,
  poster: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},{strict:false})

let concertModel = mongoose.model('concerts', concertSchema)

module.exports = concertModel;

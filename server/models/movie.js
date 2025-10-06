let mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  type: String,
  title: String,
  duration: String,
  genre: Array,
  director: Array,
  writer: Array,
  actors: Array,
  plot: String,
  language: Array,
  country: String,
  poster: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{strict:false})

let movieModel = mongoose.model('movies', movieSchema)

module.exports = movieModel

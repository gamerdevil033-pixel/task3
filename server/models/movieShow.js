let mongoose = require('mongoose')

const movieShowSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "theaters" },
    date:String,
    slot:String,
    basePrice:Number,
    ticketsBooked:Array,
    ticketsAvailable : Number
  },
  { strict: false }
) //allows to use schemaless

let movieShowModel = mongoose.model('mshows', movieShowSchema)

module.exports = movieShowModel;

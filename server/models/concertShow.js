let mongoose = require('mongoose')

const concertShowSchema = new mongoose.Schema(
  {
    concert: { type: mongoose.Schema.Types.ObjectId, ref: "concerts" },
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: "stadiums" },
    date:String,
    slot:String,
    basePrice:Number,
    ticketsBooked:Array,
    ticketsAvailable : Number
  },
  { strict: false }
) //allows to use schemaless

let concertShowModel = mongoose.model('cshows', concertShowSchema)

module.exports = concertShowModel;

let mongoose = require('mongoose')

const theaterSchema = new mongoose.Schema(
  {
    name:String,
    location:String,
    screen:Object
  },
  { strict: false }
) //allows to use schemaless

let theaterModel = mongoose.model('theaters', theaterSchema)

module.exports = theaterModel;

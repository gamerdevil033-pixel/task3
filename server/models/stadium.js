let mongoose = require('mongoose')

const stadiumSchema = new mongoose.Schema(
  {
    name:String,
    location:String,
    layout:Object
  },
  { strict: false }
) //allows to use schemaless

let stadiumModel = mongoose.model('stadiums', stadiumSchema)

module.exports = stadiumModel;

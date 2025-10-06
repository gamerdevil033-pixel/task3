let mongoose = require('mongoose')

const trainSchema = new mongoose.Schema(
  {
    trainNumber : String,
    trainName : String,
    trainType : String,
    daysOfOperation : Array,
    sationns : Object,
    classes:Object,
    vendorId:String
  },
  { strict: false }
) //allows to use schemaless

let trainModel = mongoose.model('trains', trainSchema)

module.exports = trainModel

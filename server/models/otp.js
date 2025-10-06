let mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
  {
    email:{type:String,required:true},
    otp:{type:Number,required:true},
    expiresIn: { type: Date, index: { expires:60}}
  },
  { strict: false }
) //allows to use schemaless

let otpModel = mongoose.model('otps', otpSchema)

module.exports = otpModel;

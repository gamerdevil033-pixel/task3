let mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    profileImageUrl:{type:String,default:'https://res.cloudinary.com/diizmtj04/image/upload/v1751293061/default-pic_kl5jwr.avif'},
    role: {
      type: String,
      enum: ['admin', 'vendor', 'client'],
      default: 'client'
    },
    username: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    isVerified:{
      type:Boolean,
      default:false
    },

    amountAvailable: {
      type: Number,
      default:200
    },
    isSuspended:{type:Boolean,default:false},
    myTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transactions' }]},
  { strict: false }
) //allows to use schemaless

let userModel = mongoose.model('users', userSchema)

module.exports = userModel

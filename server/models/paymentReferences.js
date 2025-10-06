let mongoose = require('mongoose')

const paymentRefSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },   
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
  link_id: String,  
  amount: Number,
  purpose: { type: String, enum: ['movie', 'concert', 'train'] },
  meta: {
    // title: String, 
    // showTime: Date,
    // seats: Number,
    // location: String       
  },
  status : { type: String, enum: ['initiated', 'pending', 'expired'], default: 'initiated' },
  createdAt : { type: Date, default: Date.now },
  expiresIn: { type: Date, index: { expires: 300} }},
  { strict: false , strictPopulate: false}
) 

let paymentRefModel = mongoose.model('paymentreferences', paymentRefSchema)

module.exports = paymentRefModel;

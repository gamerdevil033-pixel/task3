const jwt = require('jsonwebtoken')
const transactionModel = require('../models/transaction.js')
const userModel = require('../models/user.js')
const concertShowModel = require('../models/concertShow.js')
const movieShowModel = require('../models/movieShow.js')

const models = {
  movie: movieShowModel,
  concert: concertShowModel,
};


let findTransaction = async (req, res) => {
  let {id,date,fields,limit} = req.query;

  const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }

  try {
     let findRes;
    if(id){
     findRes = await transactionModel.find({_id:id},projection).populate('user').populate('vendor')
    } else if(date){
     findRes = await transactionModel.find({date:date},projection)
    }else if(limit){
     findRes = await transactionModel.find({},projection).sort({ createdAt : -1 }).limit(limit)
    }else{
     findRes = await transactionModel.find({},projection).sort({ createdAt : -1 }).populate('user').populate('vendor')
    }
   

    if (!findRes) {
      return res.status(404).json({ error: 'shows not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding show : ${err.message}`)
  }
}

const addTransaction = async (req, res) => {
  try {
    let addRes = await transactionModel.insertOne(req.body);
    res.status(201).json(addRes);
  } catch (err) {
    console.log('error in adding transaction ', err)
  }
}

const cancelTicket = async (req,res)=>{
  let {transactionId} = req.query;

 try{
   transactionModel.findOneAndUpdate({_id:transactionId},{$set:{status:"CANCELLED"}},{new:true}).then((r1)=>{
    console.log('fadsfasdfasdfdas',r1)
  
    userModel.findOneAndUpdate({ _id: r1.vendor }, {$inc: {amountAvailable:-r1.amount} }, { new: true }).then((r3) => { console.log('show updated successfully',r3); }).catch((err) => { console.log('error in money to vendor',err) })

      let model = models[r1.purpose];
      model.updateOne(
        { _id: r1.metaData.showId },
     { $pull: { seatsBooked: { transactionId : transactionId } } })
    .then((r3)=>{
         console.log('cancelled successfully')
            res.json('successfully cancelled')
    })
    })
 } catch(err){
  console.log('error in cancelling tickets')
 }
}


module.exports = { findTransaction,addTransaction,cancelTicket}

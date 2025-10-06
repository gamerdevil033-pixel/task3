const jwt = require('jsonwebtoken')
const concertModel = require('../models/concert.js')

let findConcert = async (req, res) => {
  let {concertId,fields,organizedBy} = req.query

   const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }
  
  try {
    let findRes
    if (concertId) {
      findRes = await concertModel.find({ _id: concertId },projection)
    } else if(organizedBy){
          findRes = await concertModel.find({organizedBy : organizedBy },projection)
        } else {
      findRes = await concertModel.find({},projection)
    }

    if (!findRes) {
      return res.status(404).json({ error: 'concerts not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding concert : ${err.message}`)
  }
}

const addConcert = async (req, res) => {
  try {
    let addRes = await concertModel.insertOne(req.body);
    res.status(201).json({message:"successfully created",addRes});
  } catch (err) {
    console.log('error in adding concert ', err)
  }
}

const updateConcert = async (req, res) => {
  try {
    let updateRes = await concertModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json({message:"successfully updated",updateRes});
  } catch (err) {
    console.log('error in update concert ', err)
  }
};


const deleteConcert = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await concertModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete concert ', err)
  }
}

module.exports = { findConcert,addConcert,updateConcert,deleteConcert}

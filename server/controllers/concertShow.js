const jwt = require('jsonwebtoken')
const concertShowModel = require('../models/concertShow.js')

let findShow = async (req, res) => {
  let {concertId,date,fields,showId,top} = req.query;
  console.log(showId)

  const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }

  try {
     let findRes;
     if(top){
     findRes = await concertShowModel.find({},projection).sort({ticketsAvailable:1}).limit(top)
     console.log(findRes)
     } else if(showId){
     findRes = await concertShowModel.find({_id:showId},projection).populate("concert").populate("stadium")
     console.log(findRes)
    } else if(concertId && date){
    const raw = await concertShowModel.find({date:date});
    findRes = raw.filter(d => d.concert.toString() === concertId);
          console.log(findRes)
    } else if(concertId){
      const raw = await concertShowModel.find({}).populate("concert").populate("stadium")
    findRes = raw.filter(d => d.concert._id.toString() === concertId)
          console.log(findRes)
    } else{
     findRes = await concertShowModel.find({},projection).populate("concert").populate("stadium")
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

const addShow = async (req, res) => {
  try {
    let addRes = await concertShowModel.insertOne(req.body);
    res.status(201).json("successfully created");
  } catch (err) {
    console.log('error in adding show ', err)
  }
}

const updateTicketsBooked = async (req,res) =>{
  console.log('updateShow')
  let showId = req.query.showId;
  let obj = req.body;
  console.log(showId,obj)
  try{
       let updateRes= await movieShowModel.updateOne({_id:showId},{$push:{"ticketsBooked" : obj}},{new:true});
   console.log(updateRes)
  } catch(err){
    console.log('error in updating show');
  }
}

const updateShow = async (req, res) => {
  try {
    let updateRes = await concertShowModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json({message:"successfully updated",updateRes});
  } catch (err) {
    console.log('error in update show ', err)
  }
};

const deleteShow = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await concertShowModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete show ', err)
  }
}

module.exports = { findShow,addShow,updateShow,deleteShow,updateTicketsBooked }

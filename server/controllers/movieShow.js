const jwt = require('jsonwebtoken')
const movieShowModel = require('../models/movieShow.js')
const mongoose = require('mongoose')

let findShow = async (req, res) => {
  let {movieId,date,fields,showId,top} = req.query;
  console.log(showId)


  console.log('entered')


  const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }

  try {
     let findRes;
    if(top){
       findRes = await movieShowModel.find({},projection).sort({ticketsAvailable:1}).limit(top)
          console.log(findRes)
      } else if(showId){
        console.log('came')
     findRes = await movieShowModel.find({_id:showId},projection).populate("movie").populate("theater");
    } else if(movieId && date){
      const raw = await movieShowModel.find({date:date});
    findRes = raw.filter(d => d.movie.toString() === movieId);
     console.log(findRes)
    }else if(movieId){
      const raw = await movieShowModel.find({}).populate("movie").populate("theater");
    findRes = raw.filter(d => d.movie._id.toString() === movieId);
     console.log(findRes)
    }else{
      findRes = await movieShowModel.find({},projection).populate("movie").populate("theater")
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
    let addRes = await movieShowModel.insertOne(req.body);
    res.status(200).json({message:"successfully created"})
    console.log(addRes)
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
    let updateRes = await movieShowModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json({message:"successfully updated",updateRes});
  } catch (err) {
    console.log('error in update show ', err)
  }
};

const deleteShow = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await movieShowModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete show ', err)
  }
}


module.exports = { findShow,addShow,updateShow,deleteShow,updateTicketsBooked}

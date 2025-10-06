const jwt = require('jsonwebtoken')
const trainModel = require('../models/train.js')

let findTrain = async (req, res) => {
  let {trainId,fields,organizedBy} = req.query;

   const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }
  
  try {
    let findRes
    if (trainId) {
      findRes = await trainModel.find({ _id: trainId },projection)
    }  else if(organizedBy){
      findRes = await trainModel.find({organized:organizedBy},projection)}else{
      findRes = await trainModel.find({},projection)}

    if (!findRes) {
      return res.status(404).json({ error: 'trains not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding trains : ${err.message}`)
  }
}

const addTrain = async (req, res) => {
  let {
    type,
    title,
    duration,
    genre,
    director,
    writer,
    actor,
    plot,
    language,
    country,
    poster,
    image
  } = req.body
  let movie = {type,title,duration,genre,director,writer,actor,plot,language,country,poster,image}
  try {
    let addRes = await movieModel.insertOne(movie);
    res.status(201).json("successfully created",addRes);
  } catch (err) {
    console.log('error in adding movie ', err)
  }
}

const updateTrain = async (req, res) => {
  let {
    type,
    title,
    duration,
    genre,
    director,
    writer,
    actor,
    plot,
    language,
    country,
    poster,
    image
  } = req.body
  let movie = {type,title,duration,genre,director,writer,actor,plot,language,country,poster,image}
  try {
    let addRes = await movieModel.insertOne(movie);
    res.status(201).json("successfully created",addRes);
  } catch (err) {
    console.log('error in adding movie ', err)
  }
}


module.exports = { findTrain,addTrain,updateTrain}
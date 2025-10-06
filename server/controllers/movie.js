const jwt = require('jsonwebtoken')
const movieModel = require('../models/movie.js')

let findMovie = async (req, res) => {
  let {movieId,fields,organizedBy} = req.query;

   const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }
  
  console.log(movieId);
  
  try {
    let findRes
    if (movieId) {
      findRes = await movieModel.find({ _id: movieId },projection)
    } else if(organizedBy){
      findRes = await movieModel.find({organizedBy : organizedBy },projection)
    } else {
      findRes = await movieModel.find({},projection)
    }

    if (!findRes) {
      return res.status(404).json({ error: 'movies not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding movie : ${err.message}`)
  }
}

const addMovie = async (req, res) => {
  try {
    let addRes = await movieModel.insertOne(req.body);
    res.status(201).json({message:"successfully created",addRes});
  } catch (err) {
    console.log('error in adding movie ', err)
  }
}

const updateMovie = async (req, res) => {
  try {
    let updateRes = await movieModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json({message:"successfully updated",updateRes});
  } catch (err) {
    console.log('error in update movie ', err)
  }
};


const deleteMovie = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await movieModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete movie ', err)
  }
}

module.exports = { findMovie,addMovie,updateMovie,deleteMovie}

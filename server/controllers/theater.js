const jwt = require('jsonwebtoken')
const theaterModel = require('../models/theater.js')

let findTheater = async (req, res) => {
  let {theaterId,fields} = req.query;

  console.log('theater',theaterId)

  const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }

  console.log(theaterId)
    
  try {
    let findRes;
    if(theaterId){
    findRes = await theaterModel.find({_id : theaterId},projection)
    }else{ findRes = await theaterModel.find({},projection)}
  
    if (!findRes) {
      return res.status(404).json({ error: 'theater not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding theater : ${err.message}`)
  }
}

const addTheater = async (req, res) => {
  console.log(req.body)
  try {
    let addRes = await theaterModel.insertOne(req.body);
    res.status(201).json("successfully created");
  } catch (err) {
    console.log('error in adding theater ', err)
  }
}

const updateTheater = async (req, res) => {
  try {
    let updateRes = await theaterModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json("successfully updated");
  } catch (err) {
    console.log('error in update theater ', err)
  }
};

const deleteTheater = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await theaterModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete movie ', err)
  }
}


module.exports = { findTheater,addTheater,updateTheater,deleteTheater }

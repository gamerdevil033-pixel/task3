const jwt = require('jsonwebtoken')
const stadiumModel = require('../models/stadium.js')

let findStadium = async (req, res) => {
  let {stadiumId,fields} = req.query;


  const projection = {};
  if (fields) {
    fields.split(',').forEach(field => projection[field] = 1);
  }
    
  try {
    let findRes;
    if(stadiumId){
    findRes = await stadiumModel.find({_id : stadiumId},projection)
    }else{ findRes = await stadiumModel.find({},projection)}
    console.log("successfully lauched ",findRes)

    if (!findRes) {
      return res.status(404).json({ error: 'theater not found' })
    } else {
      res.status(200).json(findRes)
    }
  } catch (err) {
    console.error(`Error finding theater : ${err.message}`)
  }
}

const addStadium = async (req, res) => {

  try {
    let addRes = await stadiumModel.insertOne(req.body);
    res.status(201).json("successfully created",addRes);
  } catch (err) {
    console.log('error in adding stadium ', err)
  }
}

const updateStadium = async (req, res) => {
  try {
    let updateRes = await stadiumModel.updateOne({_id:req.query.id},req.body);
    res.status(201).json({message:"successfully updated",updateRes});
  } catch (err) {
    console.log('error in update theater ', err)
  }
};

const deleteStadium = async (req, res) => {
  let {id} = req.query;
  try {
    let Res = await stadiumModel.deleteOne({_id:id});
    res.status(200).json({message:"successfully deleted",Res});
  } catch (err) {
    console.log('error in delete stadium ', err)
  }
}



module.exports = { findStadium,addStadium,deleteStadium,updateStadium }

let express = require('express');
let {findTrain,addTrain,updateTrain} = require('../controllers/train.js');

let trainRoutes = express.Router();

trainRoutes.get('/find',findTrain);
trainRoutes.post('/add',addTrain);
trainRoutes.patch('/update',updateTrain);

module.exports=trainRoutes;
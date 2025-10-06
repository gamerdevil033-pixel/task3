let express = require('express');
let {findTheater,addTheater,updateTheater,deleteTheater} = require('../controllers/theater.js');

let theaterRoutes = express.Router();

theaterRoutes.get('/find',findTheater);
theaterRoutes.post('/add',addTheater);
theaterRoutes.patch('/update',updateTheater);
theaterRoutes.delete('/delete',deleteTheater);

module.exports=theaterRoutes;
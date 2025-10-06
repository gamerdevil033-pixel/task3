let express = require('express');
let {findStadium,addStadium,deleteStadium,updateStadium } = require('../controllers/stadium.js');

let stadiumRoutes = express.Router();

stadiumRoutes.get('/find',findStadium);
stadiumRoutes.post('/add',addStadium);
stadiumRoutes.patch('/update',updateStadium);
stadiumRoutes.delete('/delete',deleteStadium);

module.exports=stadiumRoutes;
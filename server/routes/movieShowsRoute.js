let express = require('express');
let {findShow,addShow,updateShow,deleteShow,updateTicketsBooked} = require('../controllers/movieShow.js');

let movieShowRoutes = express.Router();

movieShowRoutes.get('/find',findShow);
movieShowRoutes.post('/add',addShow);
movieShowRoutes.put('/updateTicketsBooked',updateTicketsBooked)
movieShowRoutes.delete('/delete',deleteShow)
movieShowRoutes.patch('/update',updateShow)


module.exports=movieShowRoutes;
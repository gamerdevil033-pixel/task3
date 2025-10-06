let express = require('express');
let {findShow,addShow,updateShow,deleteShow,updateTicketsBooked} = require('../controllers/concertShow.js');

let concertShowRoutes = express.Router();

concertShowRoutes.get('/find',findShow);
concertShowRoutes.post('/add',addShow);
concertShowRoutes.put('/updateTicketsBooked',updateTicketsBooked)
concertShowRoutes.delete('/delete',deleteShow)
concertShowRoutes.patch('/update',updateShow)

module.exports=concertShowRoutes;
let express = require('express');
let {findConcert,addConcert,updateConcert,deleteConcert} = require('../controllers/concert.js');

let concertRoutes = express.Router();

concertRoutes.get('/find',findConcert);
concertRoutes.post('/add',addConcert);
concertRoutes.patch('/update',updateConcert);
concertRoutes.delete('/delete',deleteConcert);

module.exports=concertRoutes;
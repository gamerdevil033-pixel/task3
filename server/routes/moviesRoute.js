let express = require('express');
let {findMovie,addMovie,updateMovie,deleteMovie} = require('../controllers/movie.js');

let movieRoutes = express.Router();

movieRoutes.get('/find',findMovie);
movieRoutes.post('/add',addMovie);
movieRoutes.patch('/update',updateMovie);
movieRoutes.delete('/delete',deleteMovie);

module.exports=movieRoutes;
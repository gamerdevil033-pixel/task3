let express = require('express');
let {findTransaction,addTransaction,cancelTicket} = require('../controllers/transaction.js');

let transactionRoutes = express.Router();

transactionRoutes.get('/find',findTransaction);
transactionRoutes.post('/add',addTransaction);
transactionRoutes.post('/cancel',cancelTicket);

module.exports=transactionRoutes;
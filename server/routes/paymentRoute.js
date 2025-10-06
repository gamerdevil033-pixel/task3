const express = require('express');
const paymentRoute = express.Router();
const {createPaymentLink,verifyPayment} = require('../controllers/payment.js');

paymentRoute.get('/verify', verifyPayment);
paymentRoute.post('/create-link', createPaymentLink);

module.exports = paymentRoute;

let express = require('express');
const {createOtp,verifyOtp} = require('../controllers/otp.js')

const otpRoutes = express.Router()

otpRoutes.get('/create',createOtp)
otpRoutes.get('/verify',verifyOtp)


module.exports = otpRoutes;
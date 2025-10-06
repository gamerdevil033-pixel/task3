const otpModel = require('../models/otp.js')
const userModel = require('../models/user.js')
// const { sendOtp } = require('../sendMail.js')

let createOtp = async (req, res) => {
  console.log('entered')

  console.log(req.query.email)
  let { email } = req.query;
  let otp = Math.floor(Math.random() * 900000 + 1000);

  try {
    let userRes = await userModel.findOne({ email: email });
    console.log(userRes)

   return  res.status(402).json({ message: "issue with nodemailer" });


    // if (userRes) {
    //   console.log('found')
    //   let Res = await otpModel.findOne({ email: email });
    //   if(Res){
    //    return res.status(200).json({message:'Already Sended wait 2 min'})
    //   } else{
    //   let sendOtpRes = await otpModel.insertOne({ email: email, otp: otp });
    //   console.log(sendOtpRes)
    //   if (sendOtpRes) {
    //     // sendOtp(email, otp);
    //     console.log('error')
    //     res.status(200).json({message:'success'})
    //     console.log('successfully added')
    //   }
    //       else { console.log('failed in adding') }}
    // } else {
    //   res.status(404).json({ message: 'email not found' })
    //   console.log('email not found')
    // }
  } catch (err) {
    res.status(402).json({ message: err.response })
  }
}

let verifyOtp = async (req, res) => {
  let { email, otp } = req.query;

  try {
    let verifyOtpRes = await otpModel.findOne({ email: email, otp: otp });
    if (verifyOtpRes) {
      res.status(200).json({ message: 'OTP valid' })
      console.log('Otp correct')
    }
    else { res.status(201).json({ message: 'OTP invalid' }) }
  } catch (err) {

  }
}


module.exports = { createOtp, verifyOtp }
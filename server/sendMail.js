// const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
// const path = require('path');
// const generatePdf = require('./pdfGenerator')
// require('dotenv').config()

// const transporter = nodemailer.createTransport({
// service:'gmail',
// auth:{
//   user:'gamerdevil033@gmail.com',
//   pass:'acuq kycu iyhe xiyc'
// }
// })


// const sendOtp = (email,otp) =>{
//   console.log(email)

// transporter.use('compile', hbs({
//   viewEngine: {
//     extName: '.hbs',
//     partialsDir: path.resolve('./templatesF'),
//     defaultLayout: false
//   },
//   viewPath: path.resolve('./templates'),
//   extName: '.hbs'
// }));

// let options = {
//   from:'gamerdevil033@gmail.com',
//   to:email,
//   subject:'otp verification',
//   template:'otp',
//   context:{
//     otp:otp
//   }}

//   transporter.sendMail(options,(err,info)=>{
//     console.log('transporting')
//     if(err){ return console.log(err)}
//     console.log(info)
//   })
// }

// const invoiceHandler = async (req,res) =>{

// let pdfBuffer = await generatePdf(req.body);

// console.log(pdfBuffer)

// const options = {
//   from: 'gamerdevil033@gmail.com',
//   to: req.query.email,
//   subject: 'Your Invoice',
//   text: 'Please find attached your invoice.',
//   attachments: [
//     {
//       filename: 'invoice.pdf',
//       content:pdfBuffer,
//       contentType: 'application/pdf'
//     }
//   ]
// };

// transporter.sendMail(options, (error, info) => {
//   if (error) {
//     return console.error('Error sending email:', error);
//   }
//   console.log('Email sent:', info.response);
//   res.json('sent successfully')
// });
// }

// module.exports = {sendOtp,invoiceHandler};
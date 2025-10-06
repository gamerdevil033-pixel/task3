const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
// const { Server } = require("socket.io");
const fs = require('fs');

const dbRoutes = require('./routes/userdb.js')
const movieRoutes = require('./routes/moviesRoute.js')
const movieShowRoutes = require('./routes/movieShowsRoute.js')
const concertRoutes = require('./routes/concertsRoute.js')
const concertShowRoutes = require('./routes/concertShowsRoute.js')
const theaterRoutes = require('./routes/theatersRoute.js')
const stadiumRoutes = require('./routes/stadiumsRoute.js')
const paymentRoute = require('./routes/paymentRoute.js')
const trainRoutes = require('./routes/trainsRoute.js')
const transactionRoutes = require('./routes/transactionsRoute.js')
const otpRoutes = require('./routes/otpRoute.js')
const transactionModel = require('./models/transaction.js')
// const {invoiceHandler} = require('./sendMail.js')
const generatePdf = require('./pdfGenerator.js')
require('dotenv').config();

let app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: '*'
//   }
// });
// const corsOptions = {
//   origin: ['http://localhost:5003',],
//   methods: ['GET', 'POST'],
//   credentials: true, // if you're sending cookies/auth
// };

// app.use(cors());

app.use((req, res, next) => {
  const allowedOrigin = process.env.client_url; 
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use('/auth',dbRoutes);
app.use('/movie',movieRoutes);
app.use('/movieShow',movieShowRoutes);
app.use('/concert',concertRoutes);
app.use('/concertShow',concertShowRoutes);
app.use('/theater',theaterRoutes);
app.use('/stadium',stadiumRoutes);
app.use('/payment',paymentRoute);
app.use('/train',trainRoutes);
app.use('/transaction',transactionRoutes);
app.use('/otp',otpRoutes);

// app.post('/email/invoice',invoiceHandler);

app.get('/pdf/download',async (req,res)=>{
  console.log('entered')
  let r = await transactionModel.findOne({link_id:req.query.link_id});
  console.log(r)
  if(r){
  let bufferData = await generatePdf(r);
  res.set({
    'content-Type':'application/pdf',
    'content-disposition':'inline;filename="invoice.pdf"',
    'Content-length':bufferData.length,
  })
  console.log(r,bufferData)
  res.end(bufferData)
  }
  else{
    console.log('transaction not found')
  }
})


app.get('/',(req,res)=>{
res.send('hello everyone')
})

const PORT = process.env.PORT || 5000;



// io.on("connection", (socket) => {
//   console.log('client connected',socket.id)

//   socket.on('joinRoom',(roomName)=>{
//     console.log('client joined',roomName)
//     socket.join(roomName)
//   })

//   socket.on('sendMsg',({roomName,add,remove})=>{
//      socket.to(roomName).emit('receiveMsg',{add,remove});
//   })

//   socket.on('disconnect',()=>{
//     console.log('client disconnected')
//   })
// });



mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("connected to mongodb");
app.listen(PORT, () => {
  console.log(`✅ Server is listening to http://localhost:${PORT}`);
});
}).catch((err) => {
  console.log('error connecting to mongodb:' + err);
});




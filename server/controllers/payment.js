const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

const transactionModel = require('../models/transaction.js')
let userModel = require('../models/user.js')
const movieShowModel = require('../models/movieShow.js')
const concertShowModel = require('../models/concertShow.js')
const paymentRefModel = require('../models/paymentReferences.js')



async function createPaymentLink(req, res) {
  let body = req.body
 
  try {
    const requestBody = {
      customer_details: {
        customer_email: body.user.email,
        customer_name: body.user.username,
        customer_phone: "9999999999"
      },
      link_amount:body.amount,
      link_currency: "INR",
      link_purpose: "Payment for Tickets",
      link_id: "link_" + Date.now(),
      link_meta: {
        notify_url: "https://yourwebhook.url",
        return_url: `${process.env.client_url}/paymentRedirecting`,
        upi_intent: false
      },
      link_expiry_time: new Date(Date.now() + 2*60*1000),
      link_notify: {
        send_email: true,
        send_sms: false
      },
      link_partial_payments: false,
      link_auto_reminders: true,
    };



    const response = await axios.post('https://sandbox.cashfree.com/pg/links', requestBody, {
      headers: {
        'x-api-version': '2025-01-01',
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });


    const payRef = await paymentRefModel.insertOne({...body,link_id:response.data.link_id})
   
    console.log(payRef);

    res.json(response.data);
  } catch (err) {
    console.error('❌ Payment link error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || 'Payment link creation failed',
    });
  }
}

async function verifyPayment(req, r) {
  let { link_id } = req.query;

  try {
    const options = {
      headers: {
        'x-api-version': '2025-01-01',
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CLIENT_SECRET
      }
    };

    axios.get(`https://sandbox.cashfree.com/pg/links/${link_id}`, options)
      .then(res => {

           paymentRefModel.findOneAndUpdate({ link_id: res.data.link_id },
         { $set: { status: 'PAID' } },
         { new: true }
          ).lean().then((d)=>{

        let status = res.data.link_status;
            if (status === 'ACTIVE' || status === 'EXPIRED') {
          status = 'FAILED'
        }


        console.log('get link',d);

        let body = {
          ...d,
          status:status,
        }



        if (status === 'PAID' || status === 'FAILED') {


         transactionModel.insertOne(body).then((r1) => {

            let obj = {
          transactionId : r1._id,
          seatsBooked : d.metaData.seatsBooked,
          BookedBy : d.user
        }
  
          userModel.updateOne({ _id: d.user }, { $push: { "myTransactions": r1._id } })
          .then((r2) => {
                if (status === 'PAID') {
                  console.log('vendor',d.vendor)

                   userModel.findOneAndUpdate({ _id: d.vendor }, { $push: { "myTransactions": r1._id },$inc: {amountAvailable:res.data.link_amount} }, { new: true }).then((r3) => { console.log('vendor updated successfully',r3); }).catch((err) => { console.log('error in money to vendor',err) })

                  if (d.purpose === 'movie') {
                    movieShowModel.findOneAndUpdate({ _id: d.metaData.showId }, { $push: { "ticketsBooked": obj },$inc:{ticketsAvailable:-d.metaData.seatsBooked.length} }, { new: true }).then((r4) => { console.log('show updated successfully',r4); }).catch((err) => { console.log('error in updating show',err) })
                  } else if (d.purpose === 'concert') {
                    concertShowModel.findOneAndUpdate({ _id: d.metaData.showId }, { $push: { "ticketsBooked": obj },$inc:{ticketsAvailable:-d.metaData.seatsBooked.length} }, { new: true }).then((r4) => { console.log('show updated successfully',r4); }).catch((err) => { console.log('error in updating show',err) })
                  } else{console.log('train')}
                }
              }).catch((err) => { console.log('error in updating user',err)})}).catch((err) => { console.log('error in adding transaction',err) })
        }

         r.status(200).json({ status: status,...d})
        })
      })
      .catch(err => console.error(err.response.data));
  } catch (err) {
    r.status(401).json(err)
  }
}

module.exports = { createPaymentLink, verifyPayment };
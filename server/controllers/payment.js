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

async function verifyPayment(req, res) {
  let { link_id } = req.query;

  try {
    const options = {
      headers: {
        'x-api-version': '2025-01-01',
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET 
      }
    };

    const response = await axios.get(`https://sandbox.cashfree.com/pg/links/${link_id}`, options);
    const data = response.data;

   
    const d = await paymentRefModel.findOneAndUpdate(
      { link_id: data.link_id },
      { $set: { status: 'PAID' } },
      { new: true }
    ).lean();

    if (!d) {
      return res.status(404).json({ error: 'Payment reference not found' });
    }

    let status = data.link_status;
    if (status === 'ACTIVE' || status === 'EXPIRED') {
      status = 'FAILED';
    }

    let body = { ...d, status };

    if (status === 'PAID' || status === 'FAILED') {
      const transaction = await transactionModel.insertOne(body);

      const obj = {
        transactionId: transaction._id,
        seatsBooked: d.metaData.seatsBooked,
        BookedBy: d.user
      };

      await userModel.updateOne({ _id: d.user }, { $push: { myTransactions: transaction._id } });

      if (status === 'PAID') {
        if (d.vendor) {
          await userModel.findOneAndUpdate(
            { _id: d.vendor },
            { $push: { myTransactions: transaction._id }, $inc: { amountAvailable: data.link_amount } },
            { new: true }
          );
        }

        if (d.purpose === 'movie') {
          await movieShowModel.findOneAndUpdate(
            { _id: d.metaData.showId },
            { $push: { ticketsBooked: obj }, $inc: { ticketsAvailable: -d.metaData.seatsBooked.length } },
            { new: true }
          );
        } else if (d.purpose === 'concert') {
          await concertShowModel.findOneAndUpdate(
            { _id: d.metaData.showId },
            { $push: { ticketsBooked: obj }, $inc: { ticketsAvailable: -d.metaData.seatsBooked.length } },
            { new: true }
          );
        } else {
          console.log('train');
        }
      }
    }

    return res.status(200).json({ status, ...d });
  } catch (err) {
    console.error('Error verifying payment:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}


module.exports = { createPaymentLink, verifyPayment };
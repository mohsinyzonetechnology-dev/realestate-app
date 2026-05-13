const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT
|--------------------------------------------------------------------------
*/

app.post("/create-payment", async (req, res) => {
    console.log("api key: ",  process.env.SAFEPAY_SECRET_KEY)

  try {

    const { amount, currency } = req.body;

    const response = await axios.post(
  "https://sandbox.api.getsafepay.com/order/v1/init",
  {
    client: process.env.SAFEPAY_SECRET_KEY,   // REQUIRED
    environment: "sandbox",                  // REQUIRED

    amount: Number(amount),
    currency: currency || "PKR",
    intent: "sale",

    redirect_url: "myapp://payment-success",
    cancel_url: "myapp://payment-cancel",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

    res.json(response.data);
console.log(
  "SAFEPAY RESPONSE:",
  JSON.stringify(response.data, null, 2)
);
  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Payment failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| WEBHOOK
|--------------------------------------------------------------------------
*/

app.post("/webhook", async (req, res) => {

  console.log(
    "Webhook received:",
    JSON.stringify(req.body, null, 2)
  );

  
  res.sendStatus(200);
});

exports.api = functions.https.onRequest(app);
  
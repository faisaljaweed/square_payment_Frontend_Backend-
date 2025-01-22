require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Client, Environment, ApiError } = require("square");

const app = express();
app.use(bodyParser.json());

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

app.post("/create-payment", async (req, res) => {
  const { sourceId, amount } = req.body;
  try {
    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: new Date().getTime().toString(),
      amountMoney: {
        amount: parseInt(amount, 10),
        currency: "USD",
      },
    });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

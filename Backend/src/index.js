require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client, Environment, ApiError } = require("square");

const app = express();
app.use(bodyParser.json());
app.use(cors());

function convertBigIntToNumber(obj) {
  if (typeof obj === "bigint") {
    return Number(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToNumber(value),
      ])
    );
  }
  return obj;
}

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

app.post("/create-payment", async (req, res) => {
  const { sourceId, amount, name, email } = req.body;

  if (!sourceId || !amount || !name || !email) {
    console.error("Missing required fields:", {
      sourceId,
      amount,
      name,
      email,
    });
    return res.status(400).json({ error: "All fields are required." });
  }

  console.log("Received payment request:", { sourceId, amount, name, email });

  try {
    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: new Date().getTime().toString(),
      amountMoney: {
        amount: parseInt(amount, 10),
        currency: "USD",
      },
    });

    console.log("Payment Success:", result);
    const sanitizedResult = convertBigIntToNumber(result);
    res.status(200).json(sanitizedResult);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Square API Error:", error.errors);
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Unexpected Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

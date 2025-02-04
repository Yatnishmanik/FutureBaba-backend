// backend/server.js
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create an order
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise (e.g., 50000 paise = ₹500)
    currency: 'INR',
    receipt: 'order_receipt_1',
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({ id: response.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/// find prediction data based on date

const loadPredictions = () => {
  const data = fs.readFileSync("predictions.json"); // Read file
  return JSON.parse(data); // Convert to JavaScript object
};
app.post("/predictions", (req, res) => {
  const { dob } = req.body;

  if (!dob) {
    return res.status(400).json({ message: "DOB is required" });
  }

  const dobDay = dob.split("-")[2]; // ✅ Extract day part from YYYY-MM-DD format

  const predictions = loadPredictions(); // Load JSON data
  const filteredPredictions = predictions.filter((p) => p.dobDay === dobDay); // ✅ Match only by day

  if (filteredPredictions.length > 0) {
    res.json(filteredPredictions);
  } else {
    res.status(404).json({ message: "No predictions found for this DOB" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
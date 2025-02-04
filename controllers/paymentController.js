const crypto = require('crypto');
const { MERCHANT_ID, MERCHANT_KEY, CALLBACK_URL } = require('../config/constants');

exports.initiatePayment = (req, res) => {
  const { name, dob, country } = req.body;

  if (!name || !dob || !country) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const orderId = `ORDER_${Date.now()}`;
  const txnAmount = '1.00';

  const paymentRequest = {
    MID: MERCHANT_ID,
    ORDER_ID: orderId,
    TXN_AMOUNT: txnAmount,
    CUST_ID: `${name}-${dob}`,
    CALLBACK_URL,
  };

  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(paymentRequest) + MERCHANT_KEY)
    .digest('hex');

  paymentRequest.CHECKSUMHASH = checksum;

  res.json({
    paymentRequest,
    paymentUrl: `https://secure-payment-gateway.com?orderId=${orderId}`, // Mock URL
  });
};

exports.paymentCallback = (req, res) => {
  const { ORDERID, STATUS, CHECKSUMHASH } = req.body;

  const checksumData = { ...req.body };
  delete checksumData.CHECKSUMHASH;

  const calculatedChecksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(checksumData) + MERCHANT_KEY)
    .digest('hex');

  if (calculatedChecksum !== CHECKSUMHASH) {
    return res.status(400).json({ message: 'Checksum verification failed' });
  }

  if (STATUS === 'TXN_SUCCESS') {
    res.json({ message: 'Payment successful', orderId: ORDERID });
  } else {
    res.json({ message: 'Payment failed', orderId: ORDERID });
  }
};

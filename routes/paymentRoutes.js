const express = require('express');
const { initiatePayment, paymentCallback } = require('../controllers/paymentController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post('/initiate-payment',  initiatePayment);
router.post('/payment-callback', paymentCallback);

module.exports = router;

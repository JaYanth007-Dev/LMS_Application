const { Router } = require('express');
const { getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, getAllPayments } = require('../controller/payment.controller');
const router = Router();


router
    .route('/razorpay-key')
    .post(getRazorpayApiKey);
router
    .route('/subscribe')
    .post(buySubscription);
    
router
    .route('/verify')
    .post(verifySubscription);
    
router
    .route('/unsubscribe')
    .post(cancelSubscription);
    
router
    .route('/')
    .get(getAllPayments);
    

module.exports = router;
    
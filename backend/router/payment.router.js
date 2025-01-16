const { Router } = require('express');
const { getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, getAllPayments } = require('../controller/payment.controller');
const { isLoggedIn, authorizedRoles } = require('../middlewares/auth.middleware');
const router = Router();


router
    .route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayApiKey);
router
    .route('/subscribe')
    .post(
        isLoggedIn,
        buySubscription);
    
router
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription);
    
router
    .route('/unsubscribe')
    .post(
        isLoggedIn,
        cancelSubscription);
    
router
    .route('/')
    .get(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        getAllPayments);
    

module.exports = router;
    
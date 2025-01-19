const Razorpay = require("razorpay");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const { razorpay } = require("../server");

const getRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
          success: true,
          message: "Razorpay API Key",
          key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
const buySubscription = async (req, res, next) => {
    try {
         const { _id } = res.user;
        const user = await User.findById(_id); 
        if (!user) {
            return next(new AppError("Unauthorized,Please Login ", 404));
        }
     
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot a purchase a subscription", 400));
        }
        const subscription = await razorpay.subscriptions.create({
            plain_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify:1
        })

        user.subscription.id = subscription.id
        user.subscription.status = subscription.status

        await user.save();
            
        res.status(200).json({
        success: true,
        message: "Subscribed successfully",
       
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};
const verifySubscription = async (req, res, next) => {
    try {

         const { id } = req.user;
         const user = await User.findById(id);
         if (!user) {
           return next(new AppError("Unauthorized,Please Login ", 404));
         }

        const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id}=req.body
      
        const generateSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(razorpay_payment_id + "|" + razorpay_subscription_id);
        
        if(generateSignature !== razorpay_signature){
            return next(new AppError("Payment not verified, Please try again", 400))
        }
      
        // Record the payment details

        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
        })

        // Update user record with subscription status
        user.subscription.status = 'active';
        await user.save();

        res.status(200).json({
        success: true,
            message: "Payment verified successfully"
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};
const getAllPayments = async (req, res, next) => {
    try {
        const { count } = req.query;
        const subscription = await razorpay.subscriptions.all({
            count: count || 10
        })

       
      res.status(200).json({
        success: true,
        message: "All payments",
        payments: subscription ,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};
const cancelSubscription = async (req, res, next) => {
    try {

         const { id } = req.user;
        const user = await User.findById(id); 
        if (!user) {
            return next(new AppError("Unauthorized,Please Login ", 404));
        }

        if (user.role === "ADMIN") {
          return next(
            new AppError("Admin cannot cancel the subscription", 400)
          );
        }
     
        const subscriptionId = user.subscription.id;
        const subscription=await razorpay.subscriptions.cancel(subscriptionId)

        user.subscription.status = subscription.status;
      res.status(200).json({
        success: true,
        message: "Subscription Cancelled"
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};

module.exports = {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  getAllPayments,
  cancelSubscription,
};

const Razorpay = require("razorpay");


exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY, //MOHIT CHANGES 
    key_secret: process.env.RAZORPAY_SECRET,
});
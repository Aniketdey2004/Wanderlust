const Razorpay=require('razorpay');

const razorpayInstance=new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET_CODE
});

module.exports=razorpayInstance;
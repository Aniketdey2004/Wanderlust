const express=require('express');
const router=express.Router();
const razorpay=require('../razorpayConfig.js');
const ExpressError = require('../utils/ExpressError.js');

router.post('/createBooking',async (req,res)=>{
    const {amount}=req.body;
    const options={
        amount:amount*100,
        currency:"INR",
    };
    try{
        const order=await razorpay.orders.create(options);
        res.json(order);
    }
    catch(err){
        res.status(500).send("Error creating order");
    }
});

module.exports=router;
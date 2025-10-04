const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn,verifyPayment}=require('../middleware.js');
const bookController=require('../controllers/book.js');

router.route("/")
.get(isLoggedIn,wrapAsync(bookController.renderbookListing))
.post(isLoggedIn,verifyPayment,wrapAsync(bookController.bookListing));



router.delete("/:bookingId",isLoggedIn,wrapAsync(bookController.destroyBooking));

module.exports=router;
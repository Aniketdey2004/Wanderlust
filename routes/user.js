const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const passport = require('passport');
const userController=require('../controllers/user.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});
const {validateUser,isLoggedIn}=require('../middleware.js');

router.route("/signup")
.get(userController.renderSignupForm)
.post(upload.single('picture'),validateUser,wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.get("/user",isLoggedIn,userController.getUser);


router.get("/user/listings",isLoggedIn,wrapAsync(userController.getListings));


router.get("/user/reviews",isLoggedIn,wrapAsync(userController.getReviews));

router.get("/user/bookings",isLoggedIn,wrapAsync(userController.getBookings));

router.get("/user/customers",isLoggedIn,wrapAsync(userController.getCustomers));

router.get("/user/:id",wrapAsync(userController.findUser));


router.get("/logout",userController.logout);

module.exports=router;
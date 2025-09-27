const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync=require('../utils/wrapAsync.js');
const passport = require('passport');
const userController=require('../controllers/user.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});
const {validateUser,isLoggedIn}=require('../middleware.js');
const Listing=require('../models/listing.js');

router.route("/signup")
.get(userController.renderSignupForm)
.post(upload.single('picture'),validateUser,wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.get("/user",isLoggedIn,userController.getUser);
router.get("/user/listings",async(req,res)=>{
    console.log(req.user);
    res.send("good place");
});

router.get("/logout",userController.logout);

module.exports=router;
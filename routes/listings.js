const express=require('express');
const router=express.Router();
const wrapAsync=require('./../utils/wrapAsync');
const {isLoggedIn,isOwner,validateListing,validateUpdate}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});


//Listings
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.createListing));


//New Route 
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('image'),validateUpdate,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.route("/:id/book")
.get(isLoggedIn,wrapAsync(listingController.renderbookListing))
.post(isLoggedIn,wrapAsync(listingController.bookListing));

module.exports=router;
const express=require('express');
const router=express.Router();
const Listing=require('./../models/listing.js');
const wrapAsync=require('./../utils/wrapAsync');
const ExpressError=require('./../utils/ExpressError');
const {listingSchema}=require('./../schema.js');

//Middleware for validating listing
const validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((e)=>e.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}


//Listings
//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//New Route 
router.get("/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));


//Create Route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing=req.body;
    const listItem=new Listing(newListing);
    await listItem.save();
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));


//Show route 
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));


//Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    await Listing.findByIdAndUpdate(id,{...updatedItem});
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listings");
}));


module.exports=router;
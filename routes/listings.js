const express=require('express');
const router=express.Router();
const Listing=require('./../models/listing.js');
const wrapAsync=require('./../utils/wrapAsync');
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');


//Listings
//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//New Route 
router.get("/new",isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));


//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    const newListing=req.body;
    const listItem=new Listing(newListing);
    listItem.owner=req.user._id;
    await listItem.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));


//Show route 
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...updatedItem});
    if(updatedListing)
        req.flash("success","Listing updated Successfully!");
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    if(deletedItem)
        req.flash("success","Listing Deleted Successfully!");
    else
        req.flash("error","Listing you are looking for does not exist");
    res.redirect("/listings");
}));


module.exports=router;
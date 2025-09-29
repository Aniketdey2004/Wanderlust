const Listing=require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send();
    const newListing=req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    const listItem=new Listing(newListing);
    await listItem.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_300");
    res.render("listings/edit.ejs",{listing,originalUrl});
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapToken:process.env.MAP_TOKEN});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...updatedItem});
    if(req.file)
    {
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        updatedListing.save();
    }   
    if(updatedListing)
        req.flash("success","Listing updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.renderbookListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listing");
    }
    res.render("listings/book.ejs",{listing});
}

module.exports.bookListing=async (req,res)=>{
    let {id}=req.params;
    let {from,to}=req.body;
    let booking={userid:req.user._id,from,to};
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listing");
    }
    if(from===undefined || to===undefined)
    {
        req.flash("error","Bad booking");
    }
    listing.bookings.push(booking);
    let bookedListing=await listing.save();
    if(bookedListing){
        req.flash("success","Successfully Booked");
    }
    else{
        req.flash("error","Error in Booking");
    }
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    if(deletedItem)
        req.flash("success","Listing Deleted Successfully!");
    else
        req.flash("error","Listing you are looking for does not exist");
    res.redirect("/user/listings");
}
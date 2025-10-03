const Listing=require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const perPage=9;
    const page=parseInt(req.query.page) || 1;
    const filter={};
    if(req.query.category){
        filter.category=req.query.category;
    }

    const totalListings=await Listing.countDocuments(filter);

    const listings=await Listing.find(filter).skip(perPage*(page-1)).limit(perPage);

    res.render("listings/index.ejs",{allListings:listings,currentPage:page,totalPages: Math.ceil(totalListings/perPage),category:req.query.category||null});
}

module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res)=>{
    const response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send();
    const newListing=req.body;
    const url=req.file.path;
    const filename=req.file.filename;
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
    const updatedListing=await Listing.findByIdAndUpdate(id,{...updatedItem});
    if(req.file)
    {
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        updatedListing.save();
    }   
    if(updatedListing)
        req.flash("success","Listing updated Successfully!");
    else
        req.flash("error","Failed to update Listing");
    res.redirect(`/listings/${id}`);
}

module.exports.renderbookListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    if(listing.status==false){
        req.flash("error","Bookings are suspended for this listing");
        return res.redirect(`/listings/${id}`);
    }
    res.render("listings/book.ejs",{listing});
}

module.exports.bookListing=async (req,res)=>{
    let {id}=req.params;
    let {from,to,paymentId,orderId}=req.body;
    const booking={userid:req.user._id,from,to,paymentId,orderId};
    const listing=await Listing.findById(id);
    if(listing.status==false){
        req.flash("error","Told not accepting booking");
        return res.redirect(`/listings/${id}`);
    }
    listing.bookings.push(booking);
    const bookedListing=await listing.save();
    if(bookedListing){
        req.flash("success","Booking Successfull!");
        res.status(200).send("Successfull booking");
    }
    else{
        req.flash("error","Booking Failed!");
        res.status(500).send("Error in creating booking");
    }
}
module.exports.destroyBooking=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{$pull:{bookings:{userid:req.user._id}}},{new:true});
    if(listing){
        req.flash("success","Booking removed");
    }
    else{
        req.flash("error","Failed to remove booking");
    }
    res.redirect("/user/bookings");
}

module.exports.changeStatus = async (req, res) => {
    let { id } = req.params;
    let {page}=req.query;
    const listing = await Listing.findByIdAndUpdate(
        id,
        [{ $set: { status: { $not: "$status" } } }],
        { new: true }
    );
    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/user/listings");
    }
    req.flash("success", "Status Updated");
    res.redirect(`/user/listings?page=${page}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(listing && listing.bookings.length>0){
        req.flash("error","There are visitors contact them and first suspend status");
        return res.redirect("/user/customers");
    }
    const deletedItem=await Listing.findByIdAndDelete(id);
    if(deletedItem)
        req.flash("success","Listing Deleted Successfully!");
    else
        req.flash("error","Listing you are looking for does not exist");
    res.redirect("/user/listings");
}
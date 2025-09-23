const Listing=require('../models/listing.js');


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res)=>{
    const newListing=req.body;
    const listItem=new Listing(newListing);
    listItem.owner=req.user._id;
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
    res.render("listings/edit.ejs",{listing});
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...updatedItem});
    if(updatedListing)
        req.flash("success","Listing updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    if(deletedItem)
        req.flash("success","Listing Deleted Successfully!");
    else
        req.flash("error","Listing you are looking for does not exist");
    res.redirect("/listings");
}
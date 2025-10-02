const Listing=require('../models/listing.js');
const Review=require('../models/review.js');

module.exports.createReview=async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing){
        req.flash("error","Listing you are looking ofr does not exist");
        return res.redirect("/listings");
    }
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    newReview.listing=listing;
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Removed!");
    res.redirect(`/user/reviews`);
}
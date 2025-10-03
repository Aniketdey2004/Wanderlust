const Listing=require('./models/listing.js');
const Review=require('./models/review.js');
const ExpressError=require('./utils/ExpressError');
const crypto=require('crypto');
const {listingSchema,reviewSchema,userSchema}=require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review you are looking for does not exist");
        return res.redirect("/user/reviews");
    }
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Middleware for validating listing
module.exports.validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((e)=>e.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    
    if(!req.file)
    {
        throw new ExpressError(400,"image is required");
    }

    next();
}

//Middleware for validating Review
module.exports.validateReview=(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
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

module.exports.validateUpdate=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((e)=>e.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    next();
}
//Middleware for validating Review
module.exports.validateUser=(req,res,next)=>{
    let {error} =userSchema.validate(req.body);
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

module.exports.verifyPayment=(req, res,next) => {
  const { paymentId, orderId, signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_CODE);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === signature) {
    next();
  } else {
    console.log("Payment False");
    res.status(400).send("Invalid signature");
  }
}

module.exports.removeExpires=async (req,res,next)=>{
    const listings=await Listing.find({});
    for(listing of listings){
        const id=listing.bookings.filter(b=>b.to.getTime()<Date.now()).map(b=>b._id);
        if(id.length>0)
        await Listing.findByIdAndUpdate(listing._id,{$pull:{bookings:{_id:{$in:id}}}});
    }
    next();
}

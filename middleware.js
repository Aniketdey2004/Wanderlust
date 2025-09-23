const Listing=require('./models/listing.js');
const ExpressError=require('./utils/ExpressError');
const {listingSchema,reviewSchema}=require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not owner");
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
    else
    {
        next();
    }
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
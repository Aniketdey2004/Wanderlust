const User=require('../models/user.js');
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req,res)=>{
    try{
        let url=req.file.path;
        let filename=req.file.filename;
        let {username,email,password,Phone,About}=req.body;
        let newUser=new User({email,username,Phone,About});
        newUser.picture={url,filename};
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you logged out successfully");
        res.redirect("/listings");
    });
}

module.exports.getUser=(req,res)=>{
    res.render("users/profile.ejs",{user:req.user});
}

module.exports.getListings=async(req,res)=>{
    let userListing=await Listing.find({owner:req.user._id});
    res.render("users/listing.ejs",{userListing})
}

module.exports.getReviews=async(req,res)=>{
    let userReviews=await Review.find({author:req.user._id}).populate("listing");
    res.render("users/reviews.ejs",{userReviews});
}
const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const {listingSchema,reviewSchema}=require('./schema.js');
const Review=require('./models/review.js');

const MONGO_URL= 'mongodb://localhost:27017/wanderlust';

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Making connection to database
main()
.then(()=>{
    console.log("Successfully connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}
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

//Middleware for validating Review
const validateReview=(req,res,next)=>{
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

app.get("/",(req,res)=>{
    res.send("working");
});

//Listings
//Index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route 
app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));

//Create Route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing=req.body;
    const listItem=new Listing(newListing);
    await listItem.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Show route 
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    await Listing.findByIdAndUpdate(id,{...updatedItem});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listings");
}));


//Reviews
//Post Route
app.post('/listings/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// app.get("/test",async (req,res)=>{
//     const sampleList=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calgante,Goa",
//         country:"India"
//     });
//     await sampleList.save();
//     console.log("data successfully saved");
//     res.send("saved");
// });
//Path not found access handler

//Matching Unmatched Route
app.all(/.*/,(req,res,next)=>{
    throw new ExpressError(404,"Page Not Found");
});


//Error Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some error occured"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});

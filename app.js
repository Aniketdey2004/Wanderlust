const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const listings=require('./routes/listings.js');
const reviews=require('./routes/reviews.js');
const session=require('express-session');
const flash=require('connect-flash');

const MONGO_URL= 'mongodb://localhost:27017/wanderlust';

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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.get("/",(req,res)=>{
    res.send("working");
});


//listings routes
app.use("/listings",listings);

//reviews routes
app.use("/listings/:id/reviews",reviews);


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

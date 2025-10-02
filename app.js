if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

//dependencies
const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

//routers 
const listingRouter=require('./routes/listings.js');
const reviewRouter=require('./routes/reviews.js');
const userRouter=require('./routes/user.js');
const paymentRouter=require('./routes/payment.js');

// const MONGO_URL= 'mongodb://localhost:27017/wanderlust';
const DB_URL=process.env.ATLAS_DB;

//Making connection to database
main()
.then(()=>{
    console.log("Successfully connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(DB_URL);
}

//middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});
store.on("error",(err)=>{
    console.log("ERROR in saving session",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
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

//authentication middlewares for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash messages
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//listings routes
app.use("/listings",listingRouter);

//reviews routes
app.use("/listings/:id/reviews",reviewRouter);

//user routes
app.use("/",userRouter);

//payment router
app.use("/payment",paymentRouter);

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

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

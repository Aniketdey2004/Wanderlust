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
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

//routers 
const listingRouter=require('./routes/listings.js');
const reviewRouter=require('./routes/reviews.js');
const userRouter=require('./routes/user.js');

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

//middlewares
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
    next();
});

app.get("/",(req,res)=>{
    res.send("working");
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser={
//         email:"aniketdey2004@gmail.com",
//         username:"furious"
//     }
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

//listings routes
app.use("/listings",listingRouter);

//reviews routes
app.use("/listings/:id/reviews",reviewRouter);

//user routes
app.use("/",userRouter);

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

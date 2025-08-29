const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require("path");
const methodOverride=require('method-override');

const MONGO_URL= 'mongodb://localhost:27017/wanderlust';

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


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
app.get("/",(req,res)=>{
    res.send("working");
});

//Index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New Route 
app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings",async (req,res)=>{
    const newListing=req.body;
    const listItem=new Listing(newListing);
    await listItem.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listItem=await Listing.findById(id);
    res.render("listings/edit.ejs",{listItem});
});

//Show route 
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listItem=await Listing.findById(id);
    res.render("listings/show.ejs",{listItem});
});

//Update Route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const updatedItem=req.body;
    await Listing.findByIdAndUpdate(id,{...updatedItem});
    res.redirect(`/listings/${id}`);
})

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

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});
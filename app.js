const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require("path");
const MONGO_URL= 'mongodb://localhost:27017/wanderlust';

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

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
//index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
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
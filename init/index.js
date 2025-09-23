const mongoose=require('mongoose');
const Listing=require('../models/listing');
const initData=require('./data.js');
const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
.then(()=>{
    console.log("successfully connected to database");
})
.catch((err)=>{
    console.log(err);
})

async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'68ce50eb6e6ea92a8513657a'}));
    await Listing.insertMany(initData.data);
    console.log("data successfully saved");
}

initDB();
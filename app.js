const express=require('express');
const app=express();
const PORT=8080;
const mongoose=require('mongoose');

const MONGO_URL= 'mongodb://localhost:27017/wanderlust';

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

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});
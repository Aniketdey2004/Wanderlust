const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema=new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref:"Listing"
    },
    from:Date,
    to:Date,
    paymentId:String,
    orderId:String,
    customer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    expiresAt:{
        type:Date,
        expires:0
    }
});

const Book=mongoose.model("Book",bookSchema);
module.exports=Book;
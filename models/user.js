const mongoose=require('mongoose');
const {Schema}=mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    picture:{
        url:String,
        filename:String
    },
    Phone:Number,
    About:{
        type:String,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
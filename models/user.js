const mongoose=require('mongoose');
const {Schema}=mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    picture:{
        url:{
            type:String,
            default:"/photos/user.png"
        },
        filename:{
            type:String,
            default:"User"
        }
    },
    Phone:Number,
    About:{
        type:String,
    }
});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);

module.exports=User
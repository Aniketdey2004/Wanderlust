const Book=require('../models/book.js');
const Listing=require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');

module.exports.renderbookListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    if(listing.status==false){
        req.flash("error","Bookings are suspended for this listing");
        return res.redirect(`/listings/${id}`);
    }
    res.render("listings/book.ejs",{listing});
}



module.exports.bookListing=async (req,res)=>{
    let {id}=req.params;
    let {from,to,paymentId,orderId}=req.body;
    const expiresAt = new Date(new Date(to).getTime() + 24 * 60 * 60 * 1000);
    const booking={from,to,paymentId,orderId,listing:id,customer:req.user._id,expiresAt};
    const listing=await Listing.findById(id);
    if(listing.status==false){
        req.flash("error","Told not accepting booking");
        return res.redirect(`/listings/${id}`);
    }
    const newBooking=new Book(booking);
    listing.bookings.push(newBooking);
    const bookedListing=await newBooking.save();
    if(bookedListing){
        req.flash("success","Booking Successfull!");
        res.status(200).send("Successfull booking");
    }
    else{
        res.status(500).json({error:"Error in booking"});
    }
}


module.exports.destroyBooking=async (req,res)=>{
    let {id, bookingId}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{$pull:{bookings:bookingId}},{new:true});
    const deletedBooking=await Book.findByIdAndDelete(bookingId);
    if(listing && deletedBooking){
        req.flash("success","Booking removed");
    }
    else{
        req.flash("error","Failed to remove booking");
    }
    res.redirect("/user/bookings");
}

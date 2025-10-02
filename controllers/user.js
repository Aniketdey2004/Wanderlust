const User=require('../models/user.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let { username, email, password, Phone, About } = req.body;
    const newUser = new User({ email, username, Phone, About });
    newUser.picture = { url, filename };
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you logged out successfully");
    res.redirect("/listings");
  });
};

module.exports.getUser = (req, res) => {
  res.render("users/profile.ejs", { user: req.user });
};

module.exports.getListings = async (req, res) => {
  const perPage=9;
  const page=parseInt(req.query.page)||1;
  const totalListings=await Listing.countDocuments({owner:req.user._id});
  const userListing = await Listing.find({ owner: req.user._id }).skip(perPage*(page-1)).limit(perPage);
  res.render("users/listing.ejs", { userListing ,currentPage:page,totalPages:Math.ceil(totalListings/perPage)});
};

module.exports.getReviews = async (req, res) => {
  const perPage=9;
  const page=parseInt(req.query.page)||1;
  const totalReviews=await Review.countDocuments({author:req.user._id});
  const userReviews = await Review.find({ author: req.user._id }).populate(
    "listing"
  ).skip(perPage*(page-1)).limit(perPage);
  res.render("users/reviews.ejs", { userReviews ,currentPage:page,totalPages:Math.ceil(totalReviews/perPage)});
};

module.exports.getBookings = async (req, res) => {
  const bookings = [];
  const listings = await Listing.find({});
  for (let listing of listings) {
    for (let books of listing.bookings) {
      if (books.userid.equals(req.user._id)) {
        bookings.push({
          _id: listing._id,
          image:listing.image.url,
          title: listing.title,
          from: books.from,
          to: books.to,
        });
        break;
      }
    }
  }
  const totalBookings=bookings.length;
  const perPage=9;
  const page=parseInt(req.query.page)|| 1;
  const books=bookings.slice(perPage*(page-1),perPage*(page-1)+9);
  res.render("users/bookings.ejs", { bookings:books,currentPage:page,totalPages:Math.ceil(totalBookings/perPage)});
};

module.exports.getCustomers = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  const bookings = [];
  for (let listing of listings) {
    for (let booking of listing.bookings) {
      bookings.push({
        ...booking.toObject(),
        title: listing.title,
        id: listing._id,
        image:listing.image.url
      });
    }
  }
  const totalCustomers=bookings.length;
  const perPage=9;
  const page=parseInt(req.query.page)|| 1;
  const customers=bookings.slice(perPage*(page-1),perPage*(page-1)+9);
  res.render("users/customers.ejs", { bookings:customers,currentPage:page,totalPages:Math.ceil(totalCustomers/perPage) });
};

module.exports.findUser = async (req, res) => {
  let { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.flash("error", "user does not exist");
    return res.redirect("/listings");
  }
  res.render("users/profile.ejs", { user });
};

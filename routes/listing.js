const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema}= require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js")


// Route to server side validation for  the listing form 
const validateListing= (req,res,next)=>{
  const {error} = listingSchema.validate(req.body);
     if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } 
    else{
        next();
    } 
}


//SHOW LISTINGS
router.get("/",wrapAsync(async (req,res)=>{
 const allListing =   await  Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));

// //NEW ROUTE
router.get("/new",isLoggedIn,(req,res)=>{
  
    res.render("listings/new");
});

// CREATE ROUTE
// POST route
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}));


// SHOW ROUTE
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/show.ejs",{listing});
}));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Updated  sucessfullyy....!!");
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
  let deleted = await  Listing.findByIdAndDelete(id);
  req.flash("success","Deleted sucessfullyy....!!")
  res.redirect("/listings");
}));

module.exports= router;
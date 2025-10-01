const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema }= require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")



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
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}));






// SHOW ROUTE
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/show.ejs",{listing});
}));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
  

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated successfully!");
    res.redirect(`/listings/${id}`);
}));


// DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
  let deleted = await  Listing.findByIdAndDelete(id);
  req.flash("success","Deleted sucessfullyy....!!")
  res.redirect("/listings");
}));

module.exports= router;
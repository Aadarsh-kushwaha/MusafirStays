const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema}= require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js")


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
router.get("/new",(req,res)=>{
    res.render("listings/new");
});

// CREATE ROUTE
// POST route
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//SHOW ROUTE
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs",{listing});
}));

//EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
  let deleted = await  Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports= router;
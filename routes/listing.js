const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema }= require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

const listingsController = require("../controllers/listings.js");


//SHOW LISTINGS
router.get("/",wrapAsync(listingsController.index));

// //NEW ROUTE
router.get("/new",isLoggedIn,listingsController.renderNewForm);

// CREATE ROUTE
// POST route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingsController.postNew));


// SHOW ROUTE
router.get("/:id", wrapAsync(listingsController.showAllListings));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingsController.editList));

//UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(listingsController.updateListing));


// DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingsController.deleteListing));

module.exports= router;
const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema }= require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

const listingsController = require("../controllers/listings.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.route("/")
.get(wrapAsync(listingsController.index))//SHOW LISTINGS
// .post(isLoggedIn, validateListing, wrapAsync(listingsController.postNew));// CREATE ROUTE
.post(upload.single('listing[image][url]'),(req,res)=>{
    res.send(req.file);
});

// //NEW ROUTE
router.get("/new",isLoggedIn,listingsController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingsController.showAllListings))// SHOW ROUTE
.put( isLoggedIn , isOwner, validateListing, wrapAsync(listingsController.updateListing))//SHOW UPDATE 
.delete(isLoggedIn,isOwner,wrapAsync(listingsController.deleteListing));// DELETE


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingsController.editList));


module.exports= router;
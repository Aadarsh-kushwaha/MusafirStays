const express = require("express");
const router = express.Router({ mergeParams: true }); // 🔹 Parent params inherit
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const  {validateReview} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");
// const { postReview } = require("../controllers/reviews.js");


// Create a new review for a listing
router.post( "/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));

// routes/reviews.js
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteRev));


module.exports = router;

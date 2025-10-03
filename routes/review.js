const express = require("express");
const router = express.Router({ mergeParams: true }); // 🔹 Parent params inherit
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const  {validateReview} = require("../middleware.js");


// Create a new review for a listing
router.post(
  "/",
  isLoggedIn,validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success","New Review added ....!!")

    res.redirect(`/listings/${listing._id}`);
  })
);
// routes/reviews.js
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  })
);


module.exports = router;

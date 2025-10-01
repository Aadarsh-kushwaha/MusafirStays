const express = require("express");
const router = express.Router({ mergeParams: true }); // 🔹 Parent params inherit
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const  {validateReview} = require("../middleware.js");

// Middleware to validate review data
// const validateReview = (req, res, next) => {
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(", ");
//     throw new ExpressError(400, msg);
//   }
//   next();
// };

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
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success","New Review added ....!!")

    res.redirect(`/listings/${listing._id}`);
  })
);

//  Delete a review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    await Review.findByIdAndDelete(reviewId);
     req.flash("success"," Review Deleted sucessfullyy....!!")

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;

const Review =  require("../models/review");
const Listing = require("../models/listing");

module.exports.postReview = async (req, res) => {
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
  }

  module.exports.deleteRev = async (req, res) => {
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
  }
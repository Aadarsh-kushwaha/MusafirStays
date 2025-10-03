const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./schema.js");



module.exports.isLoggedIn = (req,res,next) =>{
       if(!req.isAuthenticated()){
        req.session.redirectURL= req.originalUrl;
        req.flash("error","You must be logged in before doing so !");
       return  res.redirect("/login");
       
    }
    next();
};


module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

module.exports.isOwner =async (req,res,next)=>{
     const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the owner have the access to update");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor =async (req,res,next)=>{
     const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the creator have the access to update");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing= (req,res,next)=>{
  const {error} = listingSchema.validate(req.body);
     if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } 
    else{
        next();
    } 
}

module.exports.validateReview = (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400,msg);
  } else {
    next();
  }
};

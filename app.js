const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/MusafirStay";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port=8080;
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError");
const {listingSchema , reviewSchema}= require("./schema.js")
const Review = require("./models/review.js");

// Connect to MongoDB
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("there is some error", err); 
  });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("It's features are not added yet ....");
});
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

const validateReview= (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
     if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } 
    else{
        next();
    } 
}

//SHOW LISTINGS
app.get("/listings",wrapAsync(async (req,res)=>{
 const allListing =   await  Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));

// //NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});




// CREATE ROUTE
// POST route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));




//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs",{listing});
}));

//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
  let deleted = await  Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));


// // Post route for creating reviews wrt listing's id's reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
listing.reviews.push(newReview);

await newReview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);


}
)
);



//When The request does't matches with of the routes
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });




// Middlewre for error handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});


app.listen(port,()=>{
    console.log(`Server is listenning at port ${port}...`); 
});
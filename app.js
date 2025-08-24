const express= require("express");
const app= express();
const mongoose= require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/MusafirStay";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port=8080;
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const  listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");


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
const sessionOptions ={
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie: {
    expires : Date.now() + 7 * 24 * 60*60*1000,
    maxAge : 7 * 24 * 60*60*1000,
    httpOnly : true,
  },

};
app.get("/",(req,res)=>{
    res.send("This features are not added yet ....");
});
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();
})


//ROUTING TO THE  ROUTES FOLDER 
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);





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
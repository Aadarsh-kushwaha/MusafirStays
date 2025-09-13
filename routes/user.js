const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
// sign uo  data DB me bhejne k liye  
router.post("/signup", wrapAsync(async(req,res)=>{

    try {

        let {username,email,password}=req.body;
        const newUser = new User({email,username});
       const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", `${username}, welcome to MusafirStays 🎉`);
               res.redirect("/listings");
    })
    
    }
    catch(e){
         req.flash("error", e.message);
            res.redirect("/signup");
    }
    
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
// yaha pe ham login karayenge and .authencticate function se map karaa ke dekhenge 
router.post(
    "/login" ,
    saveRedirectURL,
    passport.authenticate("local",{
        failureRedirect : "/login",
        failureFlash : true,
      }),

      async (req,res)=>{
        req.flash("success", " Welcome to MusafirStays ! ");
       res.redirect(res.locals.redirectURL || "/listings"); // fallback safe
      }
);



// LOGOUT 
router.get("/logout",(req,res,next)=>{
req.logout((err)=>{
    if(err){
       return  next(err);
    }
    req.flash("success","Logout sucessfully !");
    return res.redirect("/listings");
}

)});


module.exports = router;
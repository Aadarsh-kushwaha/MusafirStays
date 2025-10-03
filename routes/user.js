const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js");


const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignUp)
.post( wrapAsync(userController.signup));// sign up  data DB me bhejne k liye  




router.route("/login")
.get(userController.renderLogin)
.post(// yaha pe ham login karayenge and .authencticate function se map karaa ke dekhenge 
    saveRedirectURL,
    passport.authenticate("local",{
        failureRedirect : "/login",
        failureFlash : true,
      }),

      userController.checkLogin
);

// LOGOUT 
router.get("/logout",userController.logoutUser);


module.exports = router;
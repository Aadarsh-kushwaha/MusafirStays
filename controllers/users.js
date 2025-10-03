const User = require("../models/user");

module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res)=>{

    try {

        let {username,email,password}=req.body;
        const newUser = new User({email,username});
       const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", `Hello ${username}, Welcome to MusafirStays 🎉`);
               res.redirect("/listings");
    })
    
    }
    catch(e){
         req.flash("error", e.message);
            res.redirect("/signup");
    }
    
}
module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.checkLogin =async (req,res)=>{
        req.flash("success", " Welcome to MusafirStays ! ");
       res.redirect(res.locals.redirectURL || "/listings"); // fallback safe
      }

      module.exports.logoutUser = (req,res,next)=>{
req.logout((err)=>{
    if(err){
       return  next(err);
    }
    req.flash("success","Logout sucessfully !");
    return res.redirect("/listings");
}

)}
const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
 const allListing =   await  Listing.find({});
 res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm = (req,res)=>{
  
    res.render("listings/new");
}
module.exports.showAllListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
   .populate({
    path:"reviews",
    populate :{
        path :"author" ,
    },
   })
   .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.postNew = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;


  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  //newListing.image.filename = {filename};
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}
module.exports.editList = async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested  is not available ");
        return res.redirect("/listings");  // ✅ return lagaya
    }
    res.render("listings/edit.ejs",{listing});
}
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
  

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
  let deleted = await  Listing.findByIdAndDelete(id);
  req.flash("success","Deleted sucessfullyy....!!")
  res.redirect("/listings");
}
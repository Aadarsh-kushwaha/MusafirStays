const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description : String,
    image: {
        filename: String,
        url: {
          type: String,
          default:
            "https://resources.thomascook.in/images/holidays/staticPage/ThingsToDo/kerala20.jpg",
          set: (v) =>
            v == " "
              ? "https://resources.thomascook.in/images/holidays/staticPage/ThingsToDo/kerala20.jpg"
              : v,
        },
      },
    price: {
  type: Number,
  required: true
},
    location: String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

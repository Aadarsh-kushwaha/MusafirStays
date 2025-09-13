const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/MusafirStay";

// Connect to MongoDB
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to DB");
    
}).catch(err =>{
    console.log("there is some error",err);
    
});
const initDB = async () =>{
    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj)=>({...obj,owner:"68b2021bb2aa118316733e68"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");  
};
initDB();
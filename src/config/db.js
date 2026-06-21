const mongoose=require("mongoose");

const connect=async()=>{
    try{
         await mongoose.connect(process.env.MONGO_URI);
         console.log("Connected to database");
    }catch(error){
        console.log("Cannot connect successfully");
        console.error(error);
    }
};

module.exports=connect;
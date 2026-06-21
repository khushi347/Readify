const express=require("express");
const dotenv=require("dotenv");
const connect=require("./src/config/db")

dotenv.config();
const app=express();
app.use(express.json());

const startServer=async()=>{
    try{
        await connect();

        app.listen(process.env.PORT || 5000,()=>{
            console.log(`Listening on PORT ${process.env.PORT || 5000}`);
        });
    }catch(error){
        console.error(error.message);
    }
};

startServer();
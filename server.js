const express=require("express");
const dotenv=require("dotenv");
const connect=require("./src/config/db")
const authRoutes=require("./src/routes/authRoutes")

dotenv.config();
const app=express();
app.use(express.json());

app.use("/api/auth",authRoutes);

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
const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connect=require("./src/config/db")
const authRoutes=require("./src/routes/authRoutes")
const shelfRoutes=require("./src/routes/shelfRoutes")
const dashboardRoutes=require("./src/routes/dashboardRoutes")
const bookRoutes=require("./src/routes/bookRoutes")
const reflectionRoutes=require("./src/routes/reflectionRoutes")

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/shelf",shelfRoutes);
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/books",bookRoutes)
app.use("/api/reflection",reflectionRoutes)

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
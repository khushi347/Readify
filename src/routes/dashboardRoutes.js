const express=require("express")
const routes=express.Router();

const {authMiddleware}=require("../middleware/authMiddleware")
const {getDashboardSummary}=require("../controllers/dashboardController")

routes.get("/summary",authMiddleware,getDashboardSummary)

module.exports=routes;
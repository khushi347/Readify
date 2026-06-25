const express=require("express")
const router=express.Router();

const {authMiddleware}=require("../middleware/authMiddleware")

const {search,getRecommendations}=require("../controllers/bookController")

router.get("/search",search)
router.get("/recommendations",authMiddleware,getRecommendations)

module.exports=router;
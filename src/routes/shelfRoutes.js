const express=require("express")
const routes=express.Router();
const {authMiddleware}=require("../middleware/authMiddleware")

const {addBook,getShelf,updateBooks,deleteBook}=require("../controllers/shelfController")

routes.post("/",authMiddleware,addBook)
routes.get("/",authMiddleware,getShelf)
routes.patch("/:id",authMiddleware,updateBooks)
routes.delete("/:id",authMiddleware,deleteBook)

module.exports=routes;
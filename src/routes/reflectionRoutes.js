const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
    addReflection,
    getReflections,
    getAllReflections
} = require("../controllers/reflectionController");

router.get("/", authMiddleware, getAllReflections);
router.post("/:bookId", authMiddleware, addReflection);
router.get("/:bookId", authMiddleware, getReflections);

module.exports = router;
const express = require("express");
const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");

const {
    getDashboardSummary,
    updateYearlyGoal
} = require("../controllers/dashboardController");

router.get("/summary", authMiddleware, getDashboardSummary);

router.patch("/goal", authMiddleware, updateYearlyGoal);

module.exports = router;
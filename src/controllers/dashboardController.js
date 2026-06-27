const UserBook = require("../models/UserBook");
const User = require("../models/User");
const { getFavoriteGenre } = require("../services/dashboardService");

const getDashboardSummary = async (req, res) => {
    try {

        const userId = req.user.id;

        const totalBooksRead = await UserBook.countDocuments({
            user: userId
        });

        const completedBooks = await UserBook.countDocuments({
            user: userId,
            status: "completed"
        });

        const currentRead = await UserBook.countDocuments({
            user: userId,
            status: "reading"
        });

        const wantToRead = await UserBook.countDocuments({
            user: userId,
            status: "want_to_read"
        });

        const favoriteGenre = await getFavoriteGenre(userId);

        const user = await User.findById(userId);

        const yearlyGoal = user.yearlyReadingGoal;

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const endOfYear = new Date(
            new Date().getFullYear() + 1,
            0,
            1
        );

        // Completed Books This Year
        const completedThisYear = await UserBook.countDocuments({
            user: userId,
            completedAt: {
                $gte: startOfYear,
                $lt: endOfYear
            }
        });

        const remaining = Math.max(
            yearlyGoal - completedThisYear,
            0
        );

        const percentage =
            yearlyGoal > 0
                ? Math.round(
                      (completedThisYear / yearlyGoal) * 100
                  )
                : 0;

        return res.status(200).json({
            message: "Dashboard fetched successfully",

            totalBooksRead,
            completedBooks,
            currentRead,
            wantToRead,
            favoriteGenre,

            yearlyReadingGoal: {
                year: new Date().getFullYear(),
                goal: yearlyGoal,
                completed: completedThisYear,
                remaining,
                percentage
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
};

const updateYearlyGoal = async (req, res) => {
    try {

        const userId = req.user.id;
        const { yearlyReadingGoal } = req.body;

        if (
            !yearlyReadingGoal ||
            yearlyReadingGoal <= 0
        ) {
            return res.status(400).json({
                message: "Please enter a valid yearly goal"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                yearlyReadingGoal
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Yearly reading goal updated successfully",
            yearlyReadingGoal: updatedUser.yearlyReadingGoal
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
};

module.exports = {
    getDashboardSummary,
    updateYearlyGoal
};
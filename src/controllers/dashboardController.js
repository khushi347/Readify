const UserBook = require("../models/UserBook");
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

        return res.status(200).json({
            message: "Data fetched successfully",
            totalBooksRead,
            completedBooks,
            currentRead,
            wantToRead,
            favoriteGenre
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

module.exports = {
    getDashboardSummary
};
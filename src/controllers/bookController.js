const {
    searchBooks,
    searchBooksByGenre
} = require("../services/googleBooksService");

const {
    getFavoriteGenre
} = require("../services/dashboardService");

const search= async (req, res) => {

    try {

        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const books = await searchBooks(query);

        return res.status(200).json({
            message: "Books fetched successfully",
            books
        });

    } catch (error) {

        console.error(error.response.data.error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

const getRecommendations = async (req, res) => {

    try {

        const favoriteGenre = await getFavoriteGenre(req.user.id);

        if (!favoriteGenre) {

            return res.status(404).json({
                message: "No recommendations available"
            });

        }

        const books = await searchBooksByGenre(favoriteGenre);

        return res.status(200).json({
            favoriteGenre,
            recommendations: books
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

module.exports = {
    search,
    getRecommendations
};
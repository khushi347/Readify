const UserBook = require("../models/UserBook");
const mongoose = require("mongoose");

const getFavoriteGenre = async (userId) => {

    const favoriteGenre = await UserBook.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: "$genre",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 1
        }
    ]);

    return favoriteGenre.length > 0
        ? favoriteGenre[0]._id
        : null;
};

module.exports = {
    getFavoriteGenre
};
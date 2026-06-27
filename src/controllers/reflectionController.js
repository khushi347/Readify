const Reflection = require("../models/Reflection");
const UserBook = require("../models/UserBook");

const addReflection = async (req, res) => {
    try {

        const userId = req.user.id;
        const bookId = req.params.bookId;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Reflection cannot be empty"
            });
        }

        const book = await UserBook.findOne({
            _id: bookId,
            user: userId
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const reflection = await Reflection.create({
            user: userId,
            book: bookId,
            content
        });

        return res.status(201).json({
            message: "Reflection added successfully",
            reflection
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getReflections = async (req, res) => {
    try {

        const userId = req.user.id;
        const bookId = req.params.bookId;

        const book = await UserBook.findOne({
            _id: bookId,
            user: userId
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const reflections = await Reflection.find({
            user: userId,
            book: bookId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            message: "Reflections fetched successfully",
            reflections
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    addReflection,
    getReflections
};
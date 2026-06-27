const UserBook = require("../models/UserBook");

const addBook = async (req, res) => {
    try {
        const {
            bookId,
            title,
            authors,
            thumbnail,
            genre,
            totalPages,
            status,
            progress
        } = req.body;

        const userId = req.user.id;

        if (!bookId || !title || !authors || !genre) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const isBookExist = await UserBook.findOne({
            user: userId,
            bookId
        });

        if (isBookExist) {
            return res.status(409).json({
                message: "Book already in shelf"
            });
        }

        const book = await UserBook.create({
            user: userId,
            bookId,
            title,
            authors,
            thumbnail,
            genre,
            totalPages: totalPages || null,
            status: status || "want_to_read",
            progress: progress || 0
        });

        return res.status(201).json({
            message: "Successfully added book to shelf",
            book
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getShelf = async (req, res) => {
    try {

        const userId = req.user.id;

        const { status, genre, sort } = req.query;

        const filter = {
            user: userId
        };

        if (status) {
            filter.status = status;
        }

        if (genre) {
            filter.genre = genre;
        }

        let sortOption = {
            createdAt: -1
        };

        if (sort === "rating") {
            sortOption = { rating: -1 };
        }

        if (sort === "progress") {
            sortOption = { progress: -1 };
        }

        if (sort === "title") {
            sortOption = { title: 1 };
        }

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const books = await UserBook.find(filter).sort(sortOption);

        if (books.length === 0) {
            return res.status(200).json({
                message: "Shelf is empty! Explore and add books.",
                books: []
            });
        }

        return res.status(200).json({
            message: "Shelf fetched successfully",
            books
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateBook = async (req, res) => {
    try {

        const userId = req.user.id;
        const bookId = req.params.id;

        const { progress, rating, review, status, totalPages } = req.body;

        const updateData = {};

        if (progress !== undefined) {
            if (progress < 0 || progress > 100) {
                return res.status(400).json({
                    message: "Progress must be between 0 and 100"
                });
            }

            updateData.progress = progress;

            if (progress === 0) {
                updateData.status = "want_to_read";
                updateData.completedAt = null;
            } else if (progress === 100) {
                updateData.status = "completed";
                const book = await UserBook.findById(bookId);
                if (book && !book.completedAt) {
                    updateData.completedAt = new Date();
                }
            } else {
                updateData.status = "reading";
                updateData.completedAt = null;
            }
        } else if (status !== undefined) {
            updateData.status = status;
            if (status === "completed") {
                updateData.progress = 100;
                const book = await UserBook.findById(bookId);
                if (book && !book.completedAt) {
                    updateData.completedAt = new Date();
                }
            } else if (status === "want_to_read") {
                updateData.progress = 0;
                updateData.completedAt = null;
            } else if (status === "reading") {
                const book = await UserBook.findById(bookId);
                if (book && (book.progress === 0 || book.progress === 100)) {
                    updateData.progress = 10;
                }
                updateData.completedAt = null;
            }
        }

        if (totalPages !== undefined) {
            updateData.totalPages = totalPages;
        }

        if (rating !== undefined) {
            updateData.rating = rating;
        }

        if (review !== undefined) {
            updateData.review = review;
        }
        

        const updatedBook = await UserBook.findOneAndUpdate(
            {
                _id: bookId,
                user: userId
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteBook = async (req, res) => {
    try {

        const bookId = req.params.id;
        const userId = req.user.id;

        const deleted = await UserBook.findOneAndDelete({
            _id: bookId,
            user: userId
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    addBook,
    getShelf,
    updateBook,
    deleteBook
};
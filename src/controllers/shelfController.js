    const UserBook = require("../models/UserBook")

    const addBook = async (req, res) => {

        try {
            const { bookId,
                title,
                authors,
                thumbnail,
                genre
            } = req.body;

            const userId = req.user.id;

            if (!bookId || !title || !authors || !thumbnail || !genre) {
                return res.status(401).json({
                    message: "All fields are required"
                })
            }
            const isBookExist = await UserBook.findOne(
                {
                    user: userId,
                    bookId
                }
            )

            if (isBookExist) {
                return res.status(409).json({
                    message: "Book already in shelf"
                })
            }

            const book = await UserBook.create({
                user: userId,
                bookId,
                title,
                authors,
                thumbnail,
                genre
            }
            )

            return res.status(200).json({
                message: "Successfully added book to shelf",
                book
            })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    const getShelf = async (req, res) => {
        try {
            const userId = req.user.id;

            const books = await UserBook.find({
                user: userId,
            }).sort({
                createdAt: -1
            })

            if (books.length === 0) {
                return res.status(200).json({
                    message: "Shelf is empty! Explore and add books",
                    books: []
                })
            }

            return res.status(200).json({
                message: "Shelf fetched",
                books
            })
        }

        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    const updateBooks = async (req, res) => {
        try {
            const userId = req.user.id;
            const bookId = req.params.id;

            const { status, rating } = req.body;

            const updatedBook = await UserBook.findOneAndUpdate(
                {
                    _id: bookId,
                    user: req.user.id
                },
                {
                    status,
                    rating
                },
                {
                    new: true
                }
            )

            if (!updatedBook) {
                return res.status(500).json({
                    message: "No book found"
                })
            }

            return res.status(200).json({
                message: "Shelf updated!",
                book: updatedBook
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    const deleteBook=async(req,res)=>{
        try{ const bookId=req.params.id;

        const deleted=await UserBook.findOneAndDelete(
            {
                user:req.user.id,
                _id:bookId,
            },
        )

        if(!deleted){
            return res.status(404).json({
                message:"Book cannot be deleted"
            })
        }

        return res.status(200).json({
            message:"Book deleted successfully!"
        })
    }

        catch(error){
            console.error(error)
            return res.status(500).json({
                message:"Internal server error"
            })
        }
    }

    module.exports={
        addBook,
        getShelf,
        updateBooks,
        deleteBook
    }
const UserBook=require("../models/UserBook");
const mongoose=require("mongoose")

const getDashboardSummary=async(req,res)=>{
    try{
        const userId=req.user.id;
    
    const totalBooksRead=await UserBook.countDocuments({
        user:userId
    })

    const completedBooks=await UserBook.countDocuments({
        user:userId,
        status:"completed"
    })

    const currentRead=await UserBook.countDocuments({
        user:userId,
        status:"reading"
    })

    const wantToRead=await UserBook.countDocuments({
        user:userId,
        status:"want_to_read"
    })

    const favoriteGenre=await UserBook.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(req.user.id)
            }
        },

        {
            $group:{
                _id:"$genre",
                count:{
                    $sum:1
                }
            }
        },

        {
            $sort:{
                count:-1
            }
        },

        {
            $limit:1
        }
    ])

    const genre =
    favoriteGenre.length > 0
        ? favoriteGenre[0]._id
        : null;
        
    res.status(200).json({
        message:"Data fetched",
        totalBooksRead,
        completedBooks,
        currentRead,
        wantToRead,
        favoriteGenre:genre
    })

    }   
    catch(error){   
        console.error(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
    
}

module.exports={getDashboardSummary}
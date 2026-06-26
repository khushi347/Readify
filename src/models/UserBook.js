const mongoose=require("mongoose");
const User=require("./User")

const userBook=new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    bookId:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    authors:{
        type:[String],
        required:true
    },

    thumbnail:{
        type:String,
    },

    status:{
        type:String,
        enum:[
            "want_to_read",
            "completed",
            "reading",
        ],
        default:"want_to_read"
    },

    progress:{
        type:Number,
        min:0,
        max:100,
        default:0
    },

    rating:{
        type:Number,
        min:1,
        max:5
    },

    review:{
        type:String,
        maxlength:1000,
        default:""
    },

    genre:{
        type:String,
        
    }, 

},


    {
        timestamps:true
    }

)

const UserBook=new mongoose.model("UserBook",userBook)
module.exports= UserBook;
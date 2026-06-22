const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const signup=async(req,res)=>{
    //get data
    try{
        const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.status(404).json({
            message:"All fields are required"
        })
        }

    //check existing user
    const existingUser=await User.findOne(
        {email}
    )

    if(existingUser){
        return res.status(401).json({
            message:"User already registered"
        })
    }

    //hash password
    const hashed=await bcrypt.hash(
        password,10
    );

    //generate token
    const user=await User.create({
        name,
        email,
        password:hashed
    })

    //send response
    return res.status(201).json({
        message:"User created succesfully"
    })
    }

    catch(error){
        console.error(error);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
    
}

const login=async(req,res)=>{
    //get data
    try{
        const {email,password}=req.body;

    //validate data
    if(!email || !password){
        return res.status(404).json({
            message:"All fields are required"
        })
    }

    //find user by email 
    const existingUser=await User.findOne({
        email
    })

    if(!existingUser){
        return res.status(400).json({
            message:"User not found"
        })
    }

    //compare password
    const isPasswordMatch=await bcrypt.compare(
        password,existingUser.password
    )

    if(!isPasswordMatch){
        return res.status(401).json({
            message:"Email or password is incorrect"
        })
    }

    //token generation
    const userToken= jwt.sign(
        {
            id:existingUser._id
        },
        
            process.env.JWT_SECRET,

        {
            expiresIn:"7d"
        }

        
    );

    return res.status(200).json({
        message:"Logged In successfully",
        token:userToken
    })
    }catch(error){
        console.error(error);
         
        return res.status(500).json({
            message:"Internal server error"
        })
    }
    
}

const getProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        return res.status(200).json({
            id:user._id,
            name:user.name,
            email:user.email
        });
    }
    catch(error){
        console.error(error);

        return res.status(500).json({
            message:"Internal server error"
        });
    }
}

module.exports={signup,login,getProfile}
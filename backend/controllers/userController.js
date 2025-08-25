import user from "../models/userModel.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js"
const createUser =  asyncHandler(async (req,res) => {
    const {userName , email , password} = req.body;
    
    if(!userName || !email || !password){
        throw new Error("please fill all the inputs.");
    }

    const userExists = await user.findOne({email});
    if(userExists){
         res.status(400).send("email already in use !");
         return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new user({userName,email,password : hashedPassword});

    try {
        await newUser.save()
        createToken(res,newUser._id);
        res.status(201).json({_id : newUser._id, userName : newUser.userName,
            email : newUser.email , isAdmin : newUser.isAdmin});
    } catch (error) {
        res.status(400)
        throw new Error("invaild user data");
    }
})

const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;

    const existingUser = await user.findOne({email})

    if (existingUser) {
        const isPasswordVaild = await bcrypt.compare(password,existingUser.password)
        if (isPasswordVaild) {
            createToken(res,existingUser.id);
            res.status(201).json({_id : existingUser._id, userName : existingUser.userName,
            email : existingUser.email , isAdmin : existingUser.isAdmin});
            return ;
        }
    }
    res.status(401).json({ message: "Invalid email or password" });
});

const logoutCurrentUser = asyncHandler(async (req,res) => {
    res.cookie("jwt", '' ,{
        httpOnly: true,
        expires : new Date(0),
         secure: true,
         sameSite: "none",
    })
    res.status(200).json({message : "user logged out successfully"})
});

const getAllUser = asyncHandler(async (req,res) => {
    const users = await user.find({})
    res.json(users)
})

const getCurrentUserProfile = asyncHandler(async (req,res) => {
    const User = await user.findById(req.user._id)

    if (User) {
        res.json({
            _id: User._id,
            email: User.email
        })
    }else{
        res.status(404)
        throw new Error("User is not found");
    }
})

const updateCurrentUserProfile = asyncHandler(async (req,res) => {
    const User = await user.findById(req.user._id)
    if (User) {
        User.userName = req.body.userName || User.userName
        User.email = req.body.email || User.email
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            User.password = hashedPassword;
        }
        const updatedUser = await User.save()

        res.json({
            _id : updatedUser._id,
            userName : updatedUser.userName,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin,
        })
    }else{
        res.status(404)
        throw new Error("User not found");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const userToDelete = await user.findById(req.params.id);
  
  if (!userToDelete) {
    res.status(404);
    throw new Error("User not found");
  }
  if (userToDelete.isAdmin) {
    res.status(400);
    throw new Error("You can't delete Admin");
  }
  const result = await user.deleteOne({ _id: req.params.id });
  res.json({ message: "User removed" });
});

const getUserById = asyncHandler(async (req,res) => {
    const getUser = await user.findById(req.params.id);
    if(getUser){
        res.json(getUser)
    }else{
        res.status(404)
        throw new Error("User not found");
    }
})

const updateUserById = asyncHandler(async (req,res) => {
    const updateUser = await user.findById(req.params.id)
    if(updateUser){
        updateUser.userName = req.body.userName || updateUser.userName
        updateUser.email = req.body.email || updateUser.email
        updateUser.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await updateUser.save()

        res.json({
            _id : updatedUser._id,
            userName : updatedUser.userName,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin
        })
    }else{
        res.status(404)
        throw new Error("User not found");
    }
})

export {createUser, loginUser, logoutCurrentUser ,
     getAllUser , getCurrentUserProfile , updateCurrentUserProfile,
     deleteUserById, getUserById, updateUserById};
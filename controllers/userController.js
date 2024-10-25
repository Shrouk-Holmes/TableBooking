const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel")
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllusers = asyncWrapper(
    async (req, res) => {
        const userId = req.currentUser.id;
        const query = req.query
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit
        const users = await User.find({}, { "__v": false, 'password':false }).limit(limit).skip(skip)
        res.json({ status: httpStatusText.SUCCESS, data: { users } });
    })

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password ,role} = req.body;

    const oldUser = await User.findOne({ email: email })
    if (oldUser) {
        const error = AppError.create("user already exitsts", 400, httpStatusText.FAIL)
        return next(error);

    }
   const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    
    })

    const token = await  generateJWT({email :newUser.email, _id:newUser._id, role:newUser.role})
    newUser.token = token;

    await newUser.save()
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });

})

const login = asyncWrapper(async(req,res, next) => {
    const {email,password} = req.body ;
  if (!email && !password){
    const error = AppError.create("email amd password are requried", 400, httpStatusText.FAIL)
    return next(error);
  }
 const user=await  User.findOne({ email: email});
 if (!user){
    const error = AppError.create("user not found", 400  , httpStatusText.FAIL)
    return next(error);
 }
 const matchedPssword = await bcrypt.compare(password, user.password)
 if (user && matchedPssword) {

    const token = await generateJWT({email :user.email, id:user._id ,role:user.role})

    return  res.json({ status: httpStatusText.SUCCESS, data: { token} });
 }
 else {
    const error = AppError.create("somthing went wrong", 500, httpStatusText.ERROR)
    return next(error);
 }
})



const updateProfile = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id;

    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password']; 
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return next(AppError.create('Invalid updates', 400, httpStatusText.FAIL));
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
        new: true, 
        runValidators: true 
    }).select('-password -__v'); // Exclude sensitive data

    if (!updatedUser) {
        return next(AppError.create('User not found', 404, httpStatusText.FAIL));
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { user: updatedUser }
    });
});
module.exports = {
    getAllusers, login, register , updateProfile
}
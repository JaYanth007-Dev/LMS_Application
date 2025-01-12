const User = require("../models/user.model");
const { default: AppError } = require("../utils/appError");

const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    httpOnly: true,
}
    
const register = async(req,res) => {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
        return next(new AppError("Please provide all fields", 400));
    }
    const userExists =await User.findOne({ email });

    if (userExists) {
        return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      avatarUrl: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });


    if (!User) {
        return next(new AppError("User registration failed", 400));
    }


    //TODO :upload user pic

    await user.save();

    // TODO :set JWT token in cookie
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user
    })





}
const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
           return next(new AppError("Please provide all fields", 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.comparePassword(password)) { //TODO
        return next(new AppError("Email or Password do not match", 400));

    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(201).json(
        {
            success: true,
            message: "User logged in successfully",
            data: user
        }
        )

};
const logout = (req, res) => {

    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly:true
    })
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
        })

};


const getProfile = async(req, res) => {
    const user =await  User.findById(req.user.id);
    res.status(200).json
        ({
            success: true,
            message:"User details",
            data: user
        })
            

};


module.exports = {
    register,
    login,
    logout,
    getProfile
}
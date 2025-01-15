const User = require("../models/user.model");
const AppError = require("../utils/appError");
const cloudinary = require("cloudinary");
const fs = require("fs/promises");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const cookieOptions = {
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("Please provide all fields", 400));
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("Email already exists", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(new AppError("User registration failed", 400));
  }

  //TODO :upload user pic
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      }

      // remove file from the server
      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      return next(
        new AppError(e.message || "File not uploaded ,please try again", 500)
      );
    }
  }

  await user.save();

  // TODO :set JWT token in cookie
  const token = await user.generateJWTToken();
  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.comparePassword(password)) {
    //TODO
    return next(new AppError("Email or Password do not match", 400));
  }

  const token = await user.generateJWTToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User logged in successfully",
    data: user,
  });
};
const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    message: "User details",
    data: user,
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide email", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = await user.generatePasswordToken();

  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
  console.log("Reset Password", resetPasswordUrl);
  try {
    // TODO:create sendEmail
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (e) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    return next(new AppError(e.message, 500));
  }
};
const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid Token,Please try again ", 400));
  }

  user.password = password;
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = res.user;
  if (!oldPassword || !newPassword) {
    return next(
      new AppError("Old password and new password are required", 400)
    );
  }

  const user = await User.findById(_id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError("Invalid old password", 400));
  }

  user.password = newPassword;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};


const updateUser = async (req, res, next) => {
  
  const { fullName } = req.body;
  const { _id } = res.user;

  const user = await User.findById(_id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (fullName) {
    user.fullName = fullName;
  } 
  if (req.file) {
    try {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      }

      // remove file from the server
      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      return next(
        new AppError(e.message || "File not uploaded ,please try again", 500)
      );
    }


    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    })
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser
};

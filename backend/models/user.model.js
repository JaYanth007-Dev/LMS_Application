const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { jwt } = require('jsonwebtoken');
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
    minLength: [5, "Name must be atleast 5 characters"],
    maxLength: [50, "Name must be atleast 50 characters"],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
  },
  password: {
    type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 characters"],
    select:false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        },
    avatar: {
        public_id: {
                type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry:Date
}, {
    timestamps: true,
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods = {
    comparePassword:async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword,this.password)
    },

    generateJWTToken: function () {
        return jwt.sign(
            { _id: this._id, role: this.role, email: this.email, subscribtion: this.subscription },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
        });
        }
}


const User = model("User", userSchema);
module.exports = User;
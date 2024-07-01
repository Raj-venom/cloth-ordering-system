import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(

    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        address: {
            type: String
        },

        avatar: {
            type: String

        },

        phone: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {

    // if not modified return next()
    if (!this.isModified("password")) return (next())

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {

    return Jwt.sign(
        {
            // we have access of data base using "this"
            _id: this.id,  //  _id: this._id,
            email: this.email,
            address: this.address,
            fullName: this.fullName,
            phone: this.phone

        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {

    return Jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)
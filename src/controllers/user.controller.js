import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
}

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // GET USER details form frontend
    // validate if any field are empty or not
    // check if  user already exists : email, phone
    // create user object - create entry in db
    // remove password and refresh token field form response
    // check for user creation
    // return res

    const { fullName, email, password, phone, address } = req.body

    console.log(fullName, email, password, phone, address);

    if (
        [fullName, email, password, phone, address].some((field) => field?.trim() === "" || field?.trim() == undefined)
    ) {
        throw new ApiError(400, "All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { phone }]
    })

    if (existedUser) {
        throw new ApiError(400, "User with email or Phone Number already exists")
    }

    const user = await User.create(
        {
            fullName: fullName.trim(),
            email: email.trim(),
            password,
            phone: phone.trim(),
            address: address.trim()
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registerd sucessfully"))


})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // validate username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "" || field?.trim() == undefined)
    ) {
        throw new ApiError(400, "email or password is required")
    }

    const user = await User.findOne(
        {
            email
        }
    )

    if (!user) {
        throw new ApiError(401, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)


    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )



})

export {
    registerUser,
    loginUser,

}
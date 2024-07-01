import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose, { isValidObjectId } from "mongoose"
import fs from "fs"
import jwt from "jsonwebtoken"



const removeSeller = asyncHandler(async (req, res) => {

    const { userId } = req.params


    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invali user id || object id")
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
        throw new ApiError(500, {}, "something went wrong whiel deleting user")
    }

    return res
        .status(204)
        .json(new ApiResponse(204, {}, "User removed successfully"))

})

const AllSeller = asyncHandler(async (req, res) => {

    const sellers = await User.aggregate([
        {
            $match: {
                email: { $regex: "seller.", $options: 'i' }
            }
        },

        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "owner",
                as: "products"
            }
        },

        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        }
    ])


    if (!sellers) {
        throw new ApiError(500, "Something wenth wrong while fetching seller")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, sellers, "Seller fetched sucessfully"))


})

const userVisited = asyncHandler(async (req, res) => {

    fs.readFile("./src/log/totalVisits.txt", "utf-8", (err, data) => {
        if (err) {
            console.log("Error ", err);
            throw new ApiError(500, "something went wrong while fetching data ")

        }

        return res
            .status(200)
            .json(new ApiResponse(200, { totalVisitd: data }, "user visited fetched sucessfully"))

    })
})

const userVisitedLog = asyncHandler(async (req, res) => {

    fs.readFile("./src/log/log.txt", "utf-8", (err, data) => {
        if (err) {
            console.log("Error ", err);
            throw new ApiError(500, err)
        }

        const logArray = data.trim().split('\n');

        return res
            .status(200)
            .json(new ApiResponse(200, logArray, "user visited fetched sucessfully"))

    })
})


const allCustomer = asyncHandler(async (req, res) => {

    const customer = await User.aggregate([
        {
            $match: {
                email: { $not: { $regex: "samsara.com", $options: 'i' } } // Exclude sellers
            }
        },

        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        }
    ]);

    if (!customer) {
        throw new ApiError(500, "Something went wrong while fetching non-sellers");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, customer, "Non-sellers fetched successfully"));

});


export {
    removeSeller,
    AllSeller,
    userVisited,
    userVisitedLog,
    allCustomer
}
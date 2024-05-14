import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Review } from "../models/review.model.js"
import { Order } from "../models/order.models.js"
import mongoose, { isValidObjectId } from "mongoose"


const addProductReview = asyncHandler(async (req, res) => {

    const { rating, feedback } = req.body;
    const { productId } = req.params;

    if (!feedback) {
        throw new ApiError(400, "feedback is required")
    }

    console.log("id", productId);
    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "invalid productId || object id");
    }

    const orderLog = await Order.aggregate([
        {
            $match: {
                custumerId: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $match: {
                status: "DELIVERED"
            }
        }
    ])

    if (!orderLog) {
        throw new ApiError(500, "something went wrong while filtering log")
    }

    const allProduct = []
    orderLog.map((order) => order.orderItem.map((product) => allProduct.push(product.productId)))

    const uniqueProductpurchase = [...new Set(allProduct)]

    let canReview = false;
    console.log(uniqueProductpurchase);

    uniqueProductpurchase.map((id) => {
        if (id.equals(productId)) {
            canReview = true
        }
    })

    if (!canReview) {
        throw new ApiError(401, "can only review the product you purchased")
    }

    const review = await Review.create({

        customer: req.user?._id,
        product: productId,
        rating,
        feedback
    })

    const createdReview = await Review.findById(review?._id)

    if (!createdReview) {
        throw new ApiError(500, "something went wrong while submiting feedback")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdReview, "Review created sucessfully"))

})


const getProductReview = asyncHandler(async (req, res) => {

    const { productId } = req.params

    const review = await Review.aggregate([

        {
            $match: {
                product: new mongoose.Types.ObjectId(productId)
            }
        }
    ])

    if (!review) {
        throw new ApiError(500, "something went wrong while fetching review")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, review, "product review fetched successfully"))

})


export {
    addProductReview,
    getProductReview
    
}
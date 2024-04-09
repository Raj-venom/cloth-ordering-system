import mongoose, { Schema } from "mongoose";


const reviewSchema = new Schema(
    {

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },

        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 1
        },

        feedback: {
            type: String
        }
        

    }, { timestamps: true })

export const Review = mongoose.model("Review", reviewSchema)
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            enum: ["M", "L", "XL"],
            default: "M"
        }
    },
    { timestamps: true }
)

export const Category = mongoose.model("Category", categorySchema)


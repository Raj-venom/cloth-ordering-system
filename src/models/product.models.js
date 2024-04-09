import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ProductSchema = new mongoose.Schema(

    {

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        productImage: {
            type: String,
            required: true
        },

        supportImage: [
            {
                type: String
            }
        ],

        brand: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            default: 0
        },
        stock: {
            type: Number,
            default: 0
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }


    },
    { timestamps: true }

)

ProductSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model("Product", ProductSchema)
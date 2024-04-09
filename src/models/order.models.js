import mongoose from "mongoose";


// Using schema on same file
const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },

        quantity: {
            type: Number,
            required: true
        }

    },
    { timestamps: true }
)

const orderSchema = new mongoose.Schema(
    {
        custumerName: {
            type: String,
            required: true
        },

        custumerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        orderPrice: {
            type: Number,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        orderItem: {
            type: [orderItemSchema] // Schema type
        },

        shippingAddress: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "CANCELLED", "DELIVERED"],
            default: "PENDING"
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD"
        }

    },
    { timestamps: true }
)


export const Ordre = mongoose.model("Order", orderSchema)
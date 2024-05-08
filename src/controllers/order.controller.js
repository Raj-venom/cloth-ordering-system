import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Order } from "../models/order.models.js"
import { Product } from "../models/product.models.js"
import { isValidObjectId } from "mongoose"

const orderItems = asyncHandler(async (req, res) => {

    // get product details from frontEnd
    const { phone, shippingAddress, paymentMethod, orderItem } = req.body


    if (paymentMethod !== "COD" && paymentMethod !== "ONLINE") {
        throw new ApiError(400, "Valid Payment Method is required")
    }

    // validate required field 
    if (
        [shippingAddress, phone].some((field) => field?.trim() === "" || field?.trim() === undefined)
    ) {
        throw new ApiError(400, "phone and shippingAddress are required")
    }

    const orderItemObj = JSON.parse(orderItem);
    const objLength = orderItemObj.length

    if (objLength === 0) {
        throw new ApiError(400, "Order Item required")
    }

    let orderPrice = 0;
    for (let i = 0; i < objLength; i++) {

        const productId = orderItemObj[i].productId
        const quantity = orderItemObj[i].quantity

        const product = await Product.findById(productId)
        const price = (product.price) * quantity

        orderPrice += price;

    }

    console.log(orderPrice)


    // create database entry
    const order = await Order.create(
        {
            custumerName: req.user?.fullName,
            custumerId: req.user?._id,
            orderPrice,
            phone,
            orderItem: orderItemObj,
            shippingAddress,
            paymentMethod
        }
    )

    const createdOrder = await Order.findById(order?._id)

    if (!createdOrder) {
        throw new ApiError(500, "Something went wrong while taking order")
    }

    // send response 
    return res
        .status(201)
        .json(new ApiResponse(201, createdOrder, "Order created sucessfully"))

})

// Status can only be updated by sellers
const deliveredOrCancled = asyncHandler(async (req, res) => {

    const { orderId } = req.params
    const { status } = req.body

    if (!status) {
        throw new ApiError(400, "delivery status required")
    }

    if (!isValidObjectId(orderId)) {
        throw new ApiError(400, "invalid productId || object id")
    }

    const emailRegex = /^seller\.([a-zA-Z]+[a-zA-Z0-9]*)@samsara\.com$/;
    const isValidEmail = emailRegex.test(req.user?.email);

    if (!isValidEmail) {
        throw new ApiError(401, "Invalid user credentials Seller can only use deliver Or Cancle feature")
    }

    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    const currentStatus = order.status

    if (currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {

        throw new ApiError(409, `can't change the order status after ${currentStatus}`)
    }

    const updateStaus = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                status
            }
        }
    )

    if (!updateStaus) {
        throw new ApiError(500, "someting went wrong while updating the order status")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateStaus, "Order status updated sucessfully"))


})

export {
    orderItems,
    deliveredOrCancled
}
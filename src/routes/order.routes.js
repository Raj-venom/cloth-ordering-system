import { Router } from "express";

import {
    orderItems,
    deliveredOrCancled,
    cancelOrder,
    OrderStatus,
    
} from "../controllers/order.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/").post(verifyJWT, orderItems)
router.route("/seller/:orderId").patch(verifyJWT, deliveredOrCancled)
router.route("/user/:orderId").patch(verifyJWT, cancelOrder)
router.route("/status/:status").get(verifyJWT, OrderStatus)




export default router
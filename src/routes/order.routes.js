import { Router } from "express";

import {
    orderItems,
    deliveredOrCancled,
    cancelOrder

} from "../controllers/order.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/").post(verifyJWT, orderItems)
router.route("/seller/:orderId").patch(verifyJWT, deliveredOrCancled)
router.route("/user/:orderId").patch(verifyJWT, cancelOrder)



export default router
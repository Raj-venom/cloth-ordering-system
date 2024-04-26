import { Router } from "express";

import {
    orderItems,
    deliveredOrCancled

} from "../controllers/order.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/").post(verifyJWT, orderItems)
router.route("/seller/:orderId").patch(verifyJWT, deliveredOrCancled)


export default router
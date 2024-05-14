import { Router } from "express";

import {
    addProductReview,
    getProductReview

} from "../controllers/review.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/:productId").post(verifyJWT, addProductReview)
router.route("/:productId").get(getProductReview)



export default router
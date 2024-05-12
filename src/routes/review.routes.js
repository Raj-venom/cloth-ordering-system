import { Router } from "express";

import {
    addProductReview,
   

} from "../controllers/review.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/:productId").post(verifyJWT, addProductReview)



export default router
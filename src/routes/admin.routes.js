import { Router } from "express";

import {
    removeSeller,
    AllSeller,
    userVisited,
    userVisitedLog,
    allCustomer
} from "../controllers/admin.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()

router.use(verifyJWT)

router.route("/remove/user/:userId").delete(removeSeller)
router.route("/allseller").get(AllSeller)
router.route("/uservisited").get(userVisited)
router.route("/uservisitedLog").get(userVisitedLog)
router.route("/allcustomer").get(allCustomer)


export default router
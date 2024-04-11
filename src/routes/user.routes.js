import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    refreshAccessToken

} from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(loginUser)

// secured routers
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-profile").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/refresh-token").post(refreshAccessToken)



export default router
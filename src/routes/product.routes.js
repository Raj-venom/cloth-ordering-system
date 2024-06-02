import { Router } from "express";

import {
    addNewProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updatePrice,
    getProductById,
    getAllProduct,
    getAllCategory,
    getProdutName,
    getSellerAllProduct
} from "../controllers/product.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.route("/search/name").get(getProdutName)

router.route("/")
    .get(getAllProduct)
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "productImage",
                maxCount: 1
            },
            {
                name: "supportImage",
                maxCount: 4
            }
        ]),
        addNewProduct
    )

router.route("/:productId")
    .get(getProductById)
    .patch(verifyJWT, updateProduct)
    .delete(verifyJWT, deleteProduct)

router.use(verifyJWT)

router.route("/update-stock/:productId").patch(updateStock)
router.route("/update-price/:productId").patch(updatePrice)
router.route("/category/unique").get(getAllCategory)
router.route("/seller/allproduct").get(getSellerAllProduct)


export default router
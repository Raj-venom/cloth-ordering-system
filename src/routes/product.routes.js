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
    getProdutName
} from "../controllers/product.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";




const router = Router()
router.route("/search/name").get(getProdutName)

router.use(verifyJWT)

router.route("/")
    .get(getAllProduct)
    .post(
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
    .patch(updateProduct)
    .delete(deleteProduct)

router.route("/update-stock/:productId").patch(updateStock)
router.route("/update-price/:productId").patch(updatePrice)
router.route("/category/unique").get(getAllCategory)



export default router
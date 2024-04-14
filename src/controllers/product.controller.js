import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Category } from "../models/category.models.js"
import mongoose, { isValidObjectId } from "mongoose"

const addNewProduct = asyncHandler(async (req, res) => {

    // get product details from frontEnd
    // validate required field 
    // check if product already exist in sellers shop: name
    // create database entry
    // check for product creatton
    // send response


    const { name, description, brand, price, category, stock } = req.body

    const emailRegex = /^seller\.([a-zA-Z]+[a-zA-Z0-9]*)@samsara\.com$/;
    const isValidEmail = emailRegex.test(req.user?.email);

    if (!isValidEmail) {
        throw new ApiError(401, "Invalid user credentials Seller can only add product")
    }

    if (
        [name, description, brand, price, stock].some((field) => field?.trim() === "" || field?.trim() == undefined)
    ) {
        throw new ApiError(400, "All field are required")
    }

    const objCategory = JSON.parse(category);

    if (
        [objCategory.name, objCategory.color, objCategory.size].some((field) => field?.trim() === "" || field?.trim() == undefined)
    ) {
        throw new ApiError(400, "All category filed are required")
    }

    let dbCategory = await Category.findOne(
        {
            name: objCategory.name,
            color: objCategory.color,
            size: objCategory.size
        }
    )

    if (!dbCategory) {
        dbCategory = await Category.create(
            {
                name: objCategory.name.trim(),
                color: objCategory.color.trim(),
                size: objCategory.size.trim()
            }
        )
    }

    const createdCategory = await Category.findById(dbCategory._id)

    if (!createdCategory) {
        throw new ApiError(500, "something went wrong while creating category")
    }

    // const productImageLocalPath = req.files?.productImage[0].path;
    let productImageLocalPath

    if (req.files && Array.isArray(req.files.productImage) && req.files.productImage.length > 0) {
        productImageLocalPath = req.files.productImage[0].path;
    }

    if (!productImageLocalPath) {
        throw new ApiError(400, "product image is reqiured")
    }

    const supportImage = req.files['supportImage']

    if (!supportImage || supportImage.length !== 4) {
        throw new ApiError(400, "All 4 Support image are required")
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    let supportImageAll = [];

    for (const image of supportImage) {

        const supportImage = await uploadOnCloudinary(image.path)
        supportImageAll.push(supportImage.url)

    }

    const product = await Product.create(
        {
            name,
            description,
            brand,
            productImage: productImage.url,
            supportImage: supportImageAll,
            price,
            stock,
            category: createdCategory._id,
            owner: req.user?._id

        }
    )

    const createdProduct = await Product.findById(product._id)

    if (!createdProduct) {
        throw new ApiError(500, "something went wrong while adding product")
    }

    return res.status(200).json(new ApiResponse(200, createdProduct, "createed"))

})

const updateProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "productId is invalid || object id is invalid")
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(400, "Invalid product Id")
    }

    if (!product?.owner.equals(req.user?._id)) {
        throw new ApiError(401, "unauthorized Product owner")
    }

    const updateProduct = await Product.findByIdAndUpdate(

        productId,
        {
            name: name?.trim() || product.name,
            description: description?.trim() || product.description,
        },
        {
            new: true
        }

    )

    if (!updateProduct) {
        throw new ApiError(500, "Something went wrong while updating product")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Product updated successfully"))


})

const deleteProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invali product id || object id")
    }

    const product = await Product.findById(productId)

    if (!product?.owner.equals(req.user?._id)) {
        throw new ApiError(401, "unauthorize product owner")
    }

    const deleteProduct = await Product.findByIdAndDelete(productId)

    if (!deleteProduct) {
        throw new ApiError(500, "something went wrong while deleting product")
    }

    return res
        .status(204)
        .json(new ApiResponse(204, {}, "Product deleted successfully"))

})

const updateStock = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const { newStock } = req.body

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "invalid productId || invlaid object id")
    }

    const product = await Product.findById(productId)

    if (!product?.owner.equals(req.user?._id)) {
        throw new ApiError(401, "unauthorize product owner")
    }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                stock: newStock
            }

        },
        { new: true }
    )

    if (!updateProduct) {
        throw new ApiError(500, "something went wrong while updating stock")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Stock updated sucessfully"))

})

const updatePrice = asyncHandler(async (req, res) => {

    const { price } = req.body
    const { productId } = req.params


    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "invalid productId || invlaid object id")
    }

    const product = await Product.findById(productId)

    if (!product?.owner.equals(req.user?._id)) {
        throw new ApiError(401, "unauthorize product owner")
    }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                price
            }

        },
        { new: true }
    )

    if (!updateProduct) {
        throw new ApiError(500, "something went wrong while updating price")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Price updated sucessfully"))


})

const getProductById = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "invalid productId || invlaid object id")
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "No product found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"))

})


const getAllCategory = asyncHandler(async (req, res) => {

    const category = await Category.distinct("name")

    if (!category) {
        throw new ApiError(404, "No category found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "All category fetched successfull"))


})

// controllers to search products by name
const getProdutName = asyncHandler(async (req, res) => {

    const { query } = req.query

    const options = {
        page: 1,
        limit: 10
    }

    const aggregate = Product.aggregate()

    if (query) {
        aggregate.match(
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { brand: { $regex: query, $options: 'i' } }
                ]
            }
        )
    }

    aggregate.project({ name: 1 })

    const product = await Product.aggregatePaginate(aggregate, options)

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched sucessfully"))


})

export {
    addNewProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updatePrice,
    getProductById,
    getAllCategory,
    getProdutName
}
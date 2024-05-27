import { asyncHendler } from "../../../uitls/errorHandling.js";
import productModel from "../../../../DB/model/products.model.js"



export const getProducts = asyncHendler(async (req, res, next) => {
    const products = await productModel.find({}).populate([{
        path: "userId",
        select: "username email"
    }])

    return res.send({ message: "Done", products })
})

export const addProduct = asyncHendler(async (req, res, next) => {
    const { productName, price, type, discount, copun, userId, user } = req.body;
    const product = await productModel.create({ productName, price, type, discount, copun, userId, user: req.user })
    return res.send({ message: "Done", product })
})

export const deleteProduct = asyncHendler(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.deleteOne({ _id: id }, { new: true })
    return res.send({ message: "Done", product })
})

export const updateProduct = asyncHendler(async (req, res, next) => {
    const { id } = req.params;
    const { productName, price, type, discount, copun, userId } = req.body;
    const product = await productModel.findOneAndUpdate({ _id: id }, {productName, price, type, discount, copun, userId}, { new: true })
    return res.send({ message: "Done", product })
})
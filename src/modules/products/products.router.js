import * as productController from "./controller/products.js"
import { validation } from '../../middleware/validation.js';
import * as validatore from './../products/validation.js'
import { Router } from "express"
import { auth } from "../../middleware/authntication.js";

const router = Router()

router.get("/",  productController.getProducts)
router.post("/addProduct",auth, validation(validatore.addProduct), productController.addProduct)
router.delete("/deleteProduct/:id",auth, productController.deleteProduct)
router.put("/updateProduct/:id",auth, productController.updateProduct)

export default router  
 import { validation } from '../../middleware/validation.js';
 import * as validatore from './../auth/validation.js'
import * as authController from  './controller/auth.js'
import {Router} from "express"
const router = Router();

router.get("/getUsers", authController.getUsers)
router.post("/signup", validation(validatore.signup), authController.signup)
router.get("/confirmEmail/:token", authController.confirmEmail)
router.get("/reConfirmEmail/:token", authController.reConfirmEmail)
router.post("/login", authController.login)
router.put("/updateUser/:id", authController.updateUser)
router.delete("/deleteUser/:id", authController.deleteUser)

export default router 
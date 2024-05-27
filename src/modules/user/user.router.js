import { auth } from '../../middleware/authntication.js';
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import * as userController from './controller/user.js'
import { Router } from "express";

const router = Router()

// router.get("/", auth, userController.getUsers)
router.get("/",  userController.getUsers)
router.get("/getUser/:id",  userController.getUser)


router.patch("/profile/image", auth, fileUpload("user/profile", fileValidation.image).single("image"), userController.profileImage)
router.patch("/cover/image", auth, fileUpload("user/cover", fileValidation.image).array("image"), userController.coverImage)


export default router
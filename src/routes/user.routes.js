import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import verifyUser from "../middleware/auth.middleware.js";


const router = Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)
//secure routes
router.route('/logout').post(verifyUser,logoutUser)

// router.route('/refresh-token')


export default router;
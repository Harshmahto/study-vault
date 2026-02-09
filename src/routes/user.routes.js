import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import verifyUser from "../middleware/auth.middleware.js";

import { getPDFs,getPDFById,incrementDownload } from "../controllers/docs.controllers.js";

const router = Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)
//secure routes 
//user routes
// Apply verifyUser to all routes below
router.use(verifyUser);
router.route('/logout').post(logoutUser)

// pdf routes
router.route("/pdfs").get(getPDFs);
router.route("/pdfs/:id").get(getPDFById);
router.route("/pdfs/:id/download").patch(incrementDownload);











export default router;
import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/admin.middleware.js";


const router = Router();

router.get("/testadmin", verifyUser, checkRole, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin access granted! checkRole middleware is working.",
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router;
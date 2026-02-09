import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/admin.middleware.js";

import { uploadPDF,updatePDF,deletePDF } from "../controllers/docs.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Apply verifyUser and checkRole to all routes below
router.use(verifyUser, checkRole);

router.get("/testadmin", (req, res) => {
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

router.route("/upload-pdf").post(upload.single("pdf"), uploadPDF);

router.route("/update-pdf/:id").patch(updatePDF);

router.route("/delete-pdf/:id").delete(deletePDF);


export default router;

import ApiError from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const checkRole = asyncHandler(async(req,res,next)=>{
    try {
        const role = req.user.role
    
        if(role!=='Admin'){
            throw new ApiError(403,"Forbidden: Access is Denied")
        }
        next()
    } catch (error) {
            throw new ApiError(401,"Something went wrong while checking the role")
    }
})

export {checkRole}
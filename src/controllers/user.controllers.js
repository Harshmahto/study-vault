import {User} from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler} from '../utils/asyncHandler.js'
import mongoose from "mongoose"

//generate-AccessToken-And-RefreshToken

const generateAccessTokenAndRefreshToken= async (userid)=>{
    try {
        const user = await User.findById(userid)
        const accessToken = await user.genrateAccessToken();
        const refreshToken = await user.genrateRefreshToken();
        // console.log(`access token  = ${refreshToken}`)
        user.refreshToken = refreshToken;
        user.save({validationbeforesave:false})
        
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,error,"something went wrong while Genrating access token")
    }
}

export const registerUser = asyncHandler(async(req,res)=>{
    //feilds form frotend
    //validate the feilds
    //check the user exsit
    //create user
    //return user 

    const {username,fullName,email,password,role} = req.body;
    if(
        [username,fullName,email,password,role].some(feilds=>feilds?.trim() === "") 
    ){
        throw new ApiError(400,"All feilds are requied");
    }
    
    const existedUser = await User.findOne({
        $or:[{email},{username}]
    })
    
    if(existedUser){
        throw new ApiError(409,"User alredy existed")
    }
    
    const user = await User.create({
        fullName,
        email,
        password,
        username:username,
        role:role,
    })
    console.log("send data yess")

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong with registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User successfully registered")
    )

})

export const loginUser = asyncHandler(async(req,res)=>{
    //username or email form frotend
    //validate data
    //find user
    //check user exsited or not
    //check password
    //genratedAccess token
    //save the cookie to cliet

    const {username,email,password} = req.body;

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    // const existedUser = await User.findone({
    //     $or:[{username},{email}]
    // })

    const existedUser = await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })



    if(!existedUser){
        throw new ApiError(404,"User not found")
    }

    const ispasswordValid = await existedUser.isPasswordCorrect(password);

    if(!ispasswordValid){
        throw new ApiError(401,"invalid crendentials")
    }

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(existedUser._id);

    // console.log(accessToken);

    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(201,{
            user:existedUser,
        },"User logged In Successfully")
    )



})

export const logoutUser = asyncHandler(async(req,res)=>{
    const user = req.user;
    await User.updateOne({_id:user._id},{$unset:{refreshToken:1}})
    const options={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,"User logged Out Successfully")
    )

})

export const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed")
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


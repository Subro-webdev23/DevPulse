import type { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUser= async(req: Request, res: Response)=>{
    console.log("Get All User");    
}

const getSingleUser= async(req: Request, res: Response)=>{
    console.log("Get Single User");    
}

const createUser = async(req: Request, res: Response)=>{
    try {
        const user = await userService.createUserIntoDB(req.body);
        res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
        });
    } catch (error: any) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

const updateUser = async(req: Request, res: Response)=>{
    console.log("Update User");    
}

const deleteUser = async(req: Request, res: Response)=>{
    console.log("Delete User");
    
}


export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}
import type { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUser= async(req: Request, res: Response)=>{

    try {
        const result = await userService.getAllUserFromDB();

        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found in the database",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }


}

const getSingleUser = async (req: Request, res: Response) => {
    try {        
        const { id } = req.params;     
        const result = await userService.getSingleUserFromDB(id as string);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

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
const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const updateData = req.body;
        const result = await userService.updateUserFromDB(id as string, updateData);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found or update failed",
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const result = await userService.deleteUserFromDB(id as string);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted",
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error: any) {        
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}
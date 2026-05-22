import type { Request, Response } from "express";
import { issueService } from "./issue.service";


const getAllIssue= async(req: Request, res: Response)=>{
    try {
        const result = await issueService.getAllIssueFromDB();

        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No issues found in the database",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "All Issue Fetch successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
        }) 
    } 
}


const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await issueService.getSingleIssueFromDB(id as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Issue with ID ${id} not found`,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue fetched successfully",
            data: result, 
        });

    } catch (error: any) {
        console.error("Error in getSingleIssue controller:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } 
};



const createIssue = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const reporterId = req.user?.id; 

        if (!reporterId) {
            return res.status(400).json({
                success: false,
                message: "reporter_id is required in request body",
            });
        }

        const reporterExists = await issueService.getReporterfromDB(reporterId.toString());

        if (!reporterExists || reporterExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Issue creation denied. Reporter with ID ${reporterId} does not exist in the database.`,
            });
        }

        const result = await issueService.createIssueIntoDB(payload, reporterId);

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result,
        });
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } 
};


const updateIssue = async (req: Request, res: Response) => {
    try {
        console.log("Update Issue Controller Triggered");    

        const { id } = req.params;

        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update",
            });
        }

        const result = await issueService.updateIssueFromDB(id as string, updateData);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Issue with ID ${id} not found to update`,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result, 
        });

    } catch (error: any) {
        console.error("Error in updateIssue controller:", error);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } 
};


const deleteIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await issueService.deleteIssueFromDB(id as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Issue with ID ${id} not found to delete`,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully"
        });

    } catch (error: any) {
        console.error("Error in deleteIssue controller:", error);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } 
};

export const issueController = {
    getAllIssue,
    getSingleIssue,
    createIssue,
    updateIssue,
    deleteIssue
}
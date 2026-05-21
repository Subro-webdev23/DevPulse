import type { Request, Response } from "express";


const getAllIssue= async(req: Request, res: Response)=>{
    console.log("Get All Issue");    
}

const getSingleIssue= async(req: Request, res: Response)=>{
    console.log("Get Single Issue");    
}

const createIssue = async(req: Request, res: Response)=>{
    console.log("Create Issue");    
}

const updateIssue = async(req: Request, res: Response)=>{
    console.log("Update Issue");    
}

const deleteIssue = async(req: Request, res: Response)=>{
    console.log("Delete Issue");    
}

export const issueController = {
    getAllIssue,
    getSingleIssue,
    createIssue,
    updateIssue,
    deleteIssue
}
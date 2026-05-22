import { Router } from "express";
import { issueController } from "./issue.controller";

const route = Router();

route.get("/", issueController.getAllIssue)
route.get("/:id", issueController.getSingleIssue)
route.post("/", issueController.createIssue)
route.put("/:id", issueController.updateIssue)
route.delete("/:id", issueController.deleteIssue)

export const issueRoute = route;
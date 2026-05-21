import { Router } from "express";
import { issueController } from "./issue.controller";

const route = Router();

route.get("/", issueController.getAllIssue)
route.get("/:id", issueController.getSingleIssue)
route.get("/", issueController.createIssue)
route.get("/:id", issueController.updateIssue)
route.get("/:id", issueController.deleteIssue)

export const issueRoute = route;
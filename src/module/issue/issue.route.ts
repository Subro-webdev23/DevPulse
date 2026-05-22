import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../Middleware/auth";
import { authorize } from "../../Middleware/authorize";

const route = Router();

route.get("/", auth, authorize("contributor", "maintainer"), issueController.getAllIssue)
route.get("/:id", auth, authorize("contributor", "maintainer"), issueController.getSingleIssue)
route.post("/", auth, authorize("contributor", "maintainer"), issueController.createIssue)
route.put("/:id", auth, authorize("maintainer"), issueController.updateIssue)
route.delete("/:id", auth, authorize("maintainer"), issueController.deleteIssue)

export const issueRoute = route;
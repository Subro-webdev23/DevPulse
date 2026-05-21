import { Router } from "express";
import { userController } from "./user.controller";

const route = Router();

route.get("/", userController.getAllUser)
route.get("/:id", userController.getSingleUser)
route.post("/", userController.createUser)
route.put("/:id", userController.updateUser)
route.delete("/:id", userController.deleteUser)

export const userRoute = route;
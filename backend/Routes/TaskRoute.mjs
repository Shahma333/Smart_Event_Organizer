import express from "express";
import {  assignVendorToTask, createTask, deleteTask, getTaskById, getTasksByEvent, getVendorTasks, updateTask } from "../Controllers/taskController.mjs";
import {  authorize, protect } from "../Middleware/Auth.mjs";

const taskRouter = express.Router();


taskRouter.post("/create", protect,createTask);
taskRouter.put("/update/:taskId", protect, authorize(["user", "coordinator"]), updateTask);
taskRouter.get("/vendor/:vendorId", getVendorTasks);

taskRouter.get("/:eventId", protect, getTasksByEvent);

taskRouter.delete("/delete/:taskId", protect,deleteTask);
taskRouter.put("/:taskId", getTaskById); 


taskRouter.post("/assign-vendor", assignVendorToTask);
export default taskRouter;

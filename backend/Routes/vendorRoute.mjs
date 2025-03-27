import express from "express";
import { addVendor, deleteVendor, getAllVendors, getAllVendorsWithTasks, getVendorById, updateVendor } from "../Controllers/vendorController.mjs";

import { adminOnly, coordinatorOnly, protect } from "../Middleware/Auth.mjs";
const vendorRouter = express.Router();

vendorRouter.post("/add", protect, coordinatorOnly, addVendor);
vendorRouter.get("/get", protect, getAllVendors);
vendorRouter.get("/:vendorId", protect, getVendorById); 
vendorRouter.put("/:vendorId", protect, coordinatorOnly, updateVendor);

vendorRouter.get("/vendors-and-tasks", protect, adminOnly, getAllVendorsWithTasks);

vendorRouter.delete("/:vendorId", protect, coordinatorOnly, deleteVendor);

export default vendorRouter;

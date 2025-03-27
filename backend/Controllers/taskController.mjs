import mongoose from "mongoose";
import { taskCollection } from "../Models/taskModel.mjs";
import { userCollection } from "../Models/userModel.mjs";
import { vendorCollection } from "../Models/vendorModel.mjs";


export const createTask = async (req, res) => {
    try {
        const { eventId, name, description, deadline } = req.body;
        const userId = req.user._id; 

        const task = await taskCollection.create({
            eventId,
            name,
            description,
            createdBy: userId,
            status: "pending",
        });

        return res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};


 export const assignVendorToTask = async (req, res) => {
    try {
        const { taskId, vendorId } = req.body;

        const task = await taskCollection.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const vendor = await vendorCollection.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        task.vendor = vendorId;
        task.status = "assigned";
        await task.save();

        res.status(200).json({ message: "Vendor assigned successfully", task });
    } catch (error) {
        console.error("Error assigning vendor:", error);
        res.status(500).json({ message: "Server error" });
    }
};





export const getTasksByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

       
        const tasks = await taskCollection.find({ eventId })
         
            .populate("vendor");

        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found for this event" });
        }

      
        if (tasks[0].createdBy.toString() !== userId.toString() && userRole !== "coordinator") {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json({ message: "Tasks fetched successfully", tasks });
    } catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};



export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await taskCollection.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

       
        if (req.user.role === "user" && task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own tasks" });
        }

        await taskCollection.findByIdAndDelete(taskId);

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};


export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        console.log("Received Task ID:", taskId); // 🔍 Debugging log

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const task = await taskCollection.findById(taskId);
        console.log("Fetched Task:", task); // 🔍 Debugging log

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, status } = req.body;

  
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const updatedTask = await taskCollection.findByIdAndUpdate(
            taskId,
            { name, description, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};


export const getVendorTasks = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const tasks = await taskCollection.find({ vendor: vendorId }).populate("eventId", "name"); 


        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found for this vendor" });
        }

        const vendor = await vendorCollection.findById(vendorId);

        res.json({ vendor, tasks });
    } catch (error) {
        console.error("Error fetching vendor tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

export default {
    createTask,
    assignVendorToTask,
    getTasksByEvent,
    updateTask,
    deleteTask,
    getTaskById,
    getVendorTasks
};

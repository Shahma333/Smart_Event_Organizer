import { vendorCollection } from "../Models/vendorModel.mjs";
import { taskCollection } from "../Models/taskModel.mjs";
import mongoose from "mongoose";


export const addVendor = async (req, res) => {
    try {
        if (req.user.role !== "coordinator") {
            return res.status(403).send({ message: "Only coordinators can add vendors" });
        }

        console.log("Received Data:", req.body);  // 🔍 Debugging log

        const { name, serviceType, email, phone } = req.body;

        if (!phone) {
            return res.status(400).send({ message: "Phone number is required." });
        }

        const vendor = await vendorCollection.create({
            name,
            serviceType,
            phone,  
            email,
            createdBy: req.user.id,  
        });

        return res.status(201).send({ message: "Vendor added successfully", vendor });
    } catch (err) {
        console.error("Error in addVendor:", err);  
        return res.status(500).send({ message: err.message || "Internal Server Error" });
    }
};


export const getAllVendors = async (req, res) => {
  try {
      const userRole = req.user.role; // Get user role
      const userId = req.user._id; // Get user ID

      let vendors;

      if (userRole === "admin" || userRole === "coordinator") {
          // ✅ Admins & Coordinators see all vendors
          vendors = await vendorCollection.find();
      } else {
          // ✅ Users see only vendors assigned to their tasks
          const userTasks = await taskCollection.find({ assignedTo: userId }).select("vendor"); // Get tasks assigned to user
          const vendorIds = userTasks.map(task => task.vendor); // Extract vendor IDs

          vendors = await vendorCollection.find({ _id: { $in: vendorIds } });
      }

      return res.status(200).send({ message: "Vendors fetched successfully", vendors });
  } catch (err) {
      return res.status(500).send({ message: err.message || "Internal Server Error" });
  }
};




// ✅ Delete a vendor (Only Coordinators)
export const deleteVendor = async (req, res) => {
  try {
      const { vendorId } = req.params;

      // Check user role before deleting
      if (req.user.role !== "admin" && req.user.role !== "coordinator") {
          return res.status(403).json({ message: "You are not authorized to delete vendors" });
      }

      const deletedVendor = await vendorCollection.findByIdAndDelete(vendorId);

      if (!deletedVendor) {
          return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getVendorById = async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // ✅ Validate ObjectId before querying MongoDB
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ message: "Invalid Vendor ID format" });
      }
  
      const vendor = await vendorCollection.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      res.json({ vendor });
    } catch (error) {
      console.error("🔥 Error fetching vendor:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
export const updateVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        console.log("Updating vendor with ID:", vendorId);

        const updatedVendor = await vendorCollection.findByIdAndUpdate(vendorId, req.body, { new: true });

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const getAllVendorsWithTasks = async (req, res) => {
  try {
    const vendors = await vendorCollection.find(); // Fetch all vendors

    const vendorDetails = await Promise.all(
      vendors.map(async (vendor) => {
        const tasks = await taskCollection.find({ vendor: vendor._id }); // Get tasks assigned to vendor
        return { vendor, tasks };
      })
    );

    res.status(200).json({
      message: "Vendors with tasks retrieved successfully",
      vendorDetails,
    });
  } catch (error) {
    console.error("🔥 Error fetching vendors and tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

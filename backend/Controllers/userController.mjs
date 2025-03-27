import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userCollection } from "../Models/userModel.mjs";
import mongoose from "mongoose";


const generateToken = (user) => {
  console.log("🔑 Generating Token for User Role:", user.role);  // Debugging
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    expiresIn: "50m",
  });
};



export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userCollection.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: role && ["admin", "coordinator", "user"].includes(role) ? role : "user",
    });

    
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

  
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin for reactivation." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    console.log("✅ User Role During Login:", user.role); // Debugging

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role, 
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};



export const getUserProfile = async (req, res) => {
  try {
    const user = await userCollection.findById(req.user.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await userCollection.find().select("-password").lean();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await userCollection.find({ role: "user" }).select("-password").lean();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await userCollection.find({ role: "coordinator" }).select("-password").lean();
    if (!coordinators.length) {
      return res.status(404).json({ message: "No coordinators found" });
    }
    res.status(200).json(coordinators);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userCollection.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const newStatus = user.status === "active" ? "inactive" : "active";

    const updatedUser = await userCollection.findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: `User status updated to ${newStatus}`, 
      user: updatedUser 
    });

  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    const validRoles = ["user", "coordinator", "admin"];

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await userCollection.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    const updatedUser = await userCollection.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true } // ✅ Return updated user
    );

    res.status(200).json({ 
      message: `User role updated to ${newRole}`,
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};




export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, username, newPassword } = req.body;

    
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await userCollection.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });


    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;


    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

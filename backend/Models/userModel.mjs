import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'coordinator'], 
        default: 'user' 
    },
    status: { 
        type: String, 
        enum: ["active", "inactive"], 
        default: "active" 
    }
}, { timestamps: true });

export const userCollection = mongoose.model("users", UserSchema);

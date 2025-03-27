import express from "express";


import { changeUserRole, getAllUsers, getCoordinators, getUserProfile, getUsers, loginUser, registerUser, toggleUserStatus, updateUserProfile } from "../Controllers/userController.mjs";
import { adminOnly, protect } from "../Middleware/Auth.mjs";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", protect, getUserProfile);
userRouter.put("/profile/update", protect, updateUserProfile);

userRouter.get("/all", protect,  getAllUsers);
userRouter.get("/all-coordinators", protect,adminOnly,  getCoordinators);
userRouter.get("/all-users", protect,  getUsers);

userRouter.put("/status/:userId", protect, adminOnly, toggleUserStatus);
userRouter.put("/role/:userId", protect, adminOnly, changeUserRole);



export default userRouter;



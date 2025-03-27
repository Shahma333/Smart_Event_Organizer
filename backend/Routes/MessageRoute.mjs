import express from "express";
import { getMessagesForAdmin, sendMessage } from "../Controllers/messageController.mjs";
import { adminOnly, protect } from "../Middleware/Auth.mjs";


const messageRouter = express.Router();

messageRouter.post("/send", sendMessage);
messageRouter.get("/get", protect,adminOnly, getMessagesForAdmin);

export default messageRouter;
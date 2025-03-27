import env from "dotenv";
import express from "express";
import cors from "cors";
import dbConnect from "./Config/db.config.mjs";
import userRouter from "./Routes/User.route.mjs";
import eventRouter from "./Routes/Event.route.mjs";
import taskRouter from "./Routes/TaskRoute.mjs";
import guestRouter from "./Routes/GuestRoute.mjs";
import vendorRouter from "./Routes/vendorRoute.mjs";
import messageRouter from "./Routes/MessageRoute.mjs";

import path from "path";

env.config();
await dbConnect();

const app = express();
app.use(express.json());
app.use(cors());


app.use("/users", userRouter); 
app.use("/events",eventRouter);
app.use("/tasks",taskRouter);
app.use("/guests",guestRouter);
app.use("/vendors",vendorRouter);
app.use("/messages",messageRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(process.env.PORT || 2030, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});

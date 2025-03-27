
import { connect } from "mongoose";
import env from "dotenv";

env.config();

const dbConnect = async () => {
    try {
        const { connection } = await connect(process.env.MONGO_URL, {
            dbName: "EVENT",
        });
        const db = connection.db.databaseName;
        console.log("Connected to database", db);
    } catch (err) {
        console.error(err);
    }
};

export default dbConnect;

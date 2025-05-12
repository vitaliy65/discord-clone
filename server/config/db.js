import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async () => {
  const db = process.env.MONGODB_URL;

  mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

export default connectDB;

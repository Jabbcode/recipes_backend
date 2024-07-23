import mongoose from "mongoose";
import { DB_CONNECTION } from "./index";

const dbConfig = mongoose
  .connect(DB_CONNECTION!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

export default dbConfig;

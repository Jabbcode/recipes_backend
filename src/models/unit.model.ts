import { model, Schema } from "mongoose";

const unitSchema = new Schema({
  name: String,
  description: String,
});

export default model("Unit", unitSchema);

import { model, Schema } from "mongoose";

const UnitSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
});

export default model("Unit", UnitSchema);

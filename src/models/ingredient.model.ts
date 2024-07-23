import { model, Schema } from "mongoose";

const ingredientSchema = new Schema({
  name: String,
});

export default model("Ingredient", ingredientSchema);

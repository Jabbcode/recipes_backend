import { model, Schema } from "mongoose";

const IngredientSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});

export default model("Ingredient", IngredientSchema);

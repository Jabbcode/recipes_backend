import { Schema, model } from "mongoose";

const recipeSchema = new Schema({
  title: String,
  description: String,
  ingredients: [
    {
      name: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: Number,
      unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    },
  ],
});

export default model("Recipe", recipeSchema);

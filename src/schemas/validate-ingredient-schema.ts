import { body } from "express-validator";
import IngredientModel from "../models/Ingredient.model";

export const validateIngredientSchema = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser una cadena")
    .custom(async (value, { req }) => {
      const existingDoc = await IngredientModel.findOne({ name: value });
      if (existingDoc) {
        throw new Error("Ya existe un ingrediente con ese nombre");
      }
      return true;
    }),
];

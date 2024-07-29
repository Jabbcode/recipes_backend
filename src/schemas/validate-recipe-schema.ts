import mongoose from "mongoose";
import { body } from "express-validator";
import IngredientModel from "../models/Ingredient.model";
import UnitModel from "../models/Unit.model";

export const validateRecipeSchema = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser una cadena"),
  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("La descripción es obligatoria")
    .isString()
    .withMessage("La descripción debe ser una cadena")
    .isLength({ max: 250 })
    .withMessage("La descripcion debe tener un maximo de 250 caracteres"),
  body("ingredients")
    .isArray()
    .withMessage("Los ingredientes deben ser un arreglo")
    .not()
    .isEmpty()
    .withMessage("Los ingredientes son obligatorios"),
  body("ingredients.*.name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("El nombre del ingrediente es obligatorio")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(
          "El Id del ingrediente debe ser un ID de MongoDB válido"
        );
      }
      return true;
    })
    .custom(async (value) => {
      const ingredient = await IngredientModel.findById(value);
      if (!ingredient) {
        throw new Error("El ingrediente no existe");
      }
      return true;
    }),
  body("ingredients.*.quantity")
    .isNumeric()
    .withMessage("La cantidad del ingrediente debe ser un número")
    .not()
    .isEmpty()
    .withMessage("La cantidad del ingrediente es obligatoria"),
  body("ingredients.*.unit")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("El Id de la unidad debe ser un ID de MongoDB válido");
      }
      return true;
    })
    .custom(async (value) => {
      const unit = await UnitModel.findById(value);
      if (!unit) {
        throw new Error("La unidad no existe");
      }
      return true;
    }),
];

import { body } from "express-validator";
import UnitModel from "../models/Unit.model";

export const validateUnitSchema = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser una cadena")
    .custom(async (value, { req }) => {
      const existingDoc = await UnitModel.findOne({ name: value });
      if (existingDoc) {
        throw new Error("Ya existe una unidad con ese nombre");
      }
      return true;
    }),
  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("La descripcion es obligatoria")
    .isString()
    .withMessage("La descripcion debe ser una cadena")
    .isLength({ max: 20 })
    .withMessage("La descripcion debe tener un maximo de 20 caracteres"),
];

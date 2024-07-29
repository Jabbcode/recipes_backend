import { Request, Response } from "express";
import IngredientModel from "../models/Ingredient.model";
import { validateIngredientSchema } from "../schemas/validate-ingredient-schema";
import { validationResult } from "express-validator";

export const getAllIngredients = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const ingreidients = await IngredientModel.find()
    .skip(skip)
    .limit(limitNumber)
    .select("name");

  ingreidients.length === 0 && res.status(404);

  const totalIngredients = await IngredientModel.countDocuments();
  const totalPages = Math.ceil(totalIngredients / limitNumber);

  const response = {
    ingreidients,
    totalPages,
    totalIngredients,
  };

  return res
    .header("Cache-Control", "public, max-age=3600")
    .status(200)
    .json(response);
};

export const getIngredientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ingredient = await IngredientModel.findById(id).select("name");

  if (!ingredient) {
    return res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  return res
    .header("ETag", String(ingredient!._id))
    .status(200)
    .json(ingredient);
};

export const createIngredient = async (req: Request, res: Response) => {
  await Promise.all(
    validateIngredientSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const newIngredient = new IngredientModel(req.body);
    await newIngredient.save();

    return res.status(201).json({
      message: "El ingrediente se a agrego correctamente",
      newIngredient,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  await Promise.all(
    validateIngredientSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name } = req.body;

  const ingredientFind = await IngredientModel.findById(id);

  if (!ingredientFind) {
    return res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  try {
    await IngredientModel.updateOne({ _id: id }, { name });
    return res
      .status(200)
      .json({ message: "Ingrediente actualizado con éxito", data: { name } });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ingredient = await IngredientModel.findById(id);

  if (!ingredient) {
    return res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  try {
    await IngredientModel.deleteOne({ _id: id });
    return res
      .status(204)
      .json({ message: `Ingrediente con ${id} borrado correctamente` });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

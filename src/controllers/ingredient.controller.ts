import { Request, Response } from "express";
import Ingredient from "../models/ingredient.model";

export const getAllIngredients = async (req: Request, res: Response) => {
  const ingreidients = await Ingredient.find().select("name");
  ingreidients.length === 0 && res.status(404);
  res.status(200).json(ingreidients);
};

export const getIngredientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ingredient = await Ingredient.findById(id).select("name");

  if (!ingredient) {
    res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  res.status(200).json(ingredient);
};

export const createIngredient = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newIngredient = new Ingredient({ name });
  await newIngredient.save();

  res.status(201).json(newIngredient);
};

export const updateIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const ingredient = await Ingredient.findById(id);

  if (!ingredient) {
    res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  const updateIngredient = Ingredient.findByIdAndUpdate(id, { name });

  res.status(200).json(updateIngredient);
};

export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ingredient = await Ingredient.findById(id);

  if (!ingredient) {
    res.status(404).json({
      message: `El ingrediente con el ${id}, no existe`,
    });
  }

  await Ingredient.deleteOne({ _id: id });

  res
    .status(204)
    .json({ message: `Ingrediente con ${id} borrado correctamente` });
};

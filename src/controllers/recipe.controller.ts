import { Request, Response } from "express";
import Recipe from "../models/recipe.model";

export const getAllRecipes = async (req: Request, res: Response) => {
  const recipes = await Recipe.find().populate([
    {
      path: "ingredients.unit",
      select: ["name", "description"],
    },
    { path: "ingredients.name", select: "name" },
  ]);

  if (recipes.length === 0) {
    res.status(404);
  }

  res.status(200).json(recipes);
};

export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id).populate([
    {
      path: "ingredients.unit",
      select: ["name", "description"],
    },
    { path: "ingredients.name", select: "name" },
  ]);

  if (!recipe) {
    res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  res.status(200).json(recipe);
};

export const createRecipe = async (req: Request, res: Response) => {
  const { title, description, ingredients } = req.body;
  const newRecipe = new Recipe({ title, description, ingredients });
  await newRecipe.save();

  res.status(201).json(newRecipe);
};

export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, ingredients } = req.body;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  Recipe.updateOne({ _id: id }, { $set: { title, description, ingredients } })
    .then((result) => res.json({ message: "Recipe updated successfully" }))
    .catch((err) => res.status(500).json({ message: "Error updating recipe" }));
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  await Recipe.deleteOne({ _id: id });

  res.status(204).json({ message: `Receta con ${id} borrado correctamente` });
};

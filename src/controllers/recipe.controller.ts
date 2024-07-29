import { Request, Response } from "express";
import { validationResult } from "express-validator";
import RecipeModel from "../models/Recipe.model";
import { validateRecipeSchema } from "../schemas/validate-recipe-schema";

export const getAllRecipes = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const recipes = await RecipeModel.find()
    .skip(skip)
    .limit(limitNumber)
    .populate([
      {
        path: "ingredients.unit",
        select: ["name", "description"],
      },
      { path: "ingredients.name", select: "name" },
    ]);

  if (!recipes) {
    return res.status(404);
  }

  const totalRecipes = await RecipeModel.countDocuments();
  const totalPages = Math.ceil(totalRecipes / limitNumber);

  const response = {
    recipes,
    totalPages,
    totalRecipes,
  };

  return res
    .header("Cache-Control", "public, max-age=3600")
    .status(200)
    .json(response);
};

export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = await RecipeModel.findById(id).populate([
    {
      path: "ingredients.unit",
      select: ["name", "description"],
    },
    { path: "ingredients.name", select: "name" },
  ]);

  if (!recipe) {
    return res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  return res.header("ETag", String(recipe!._id)).status(200).json(recipe);
};

export const createRecipe = async (req: Request, res: Response) => {
  await Promise.all(
    validateRecipeSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const newRecipe = new RecipeModel(req.body);
    await newRecipe.save();

    return res
      .status(201)
      .json({ message: "La recera se a creado correctamente", newRecipe });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  await Promise.all(
    validateRecipeSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, ingredients } = req.body;

  const recipe = await RecipeModel.findById(id);

  if (!recipe) {
    res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  try {
    await RecipeModel.updateOne(
      { _id: id },
      { $set: { title, description, ingredients } }
    );
    return res.status(200).json({
      message: "Recipe updated successfully",
      data: {
        title,
        description,
        ingredients,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating recipe" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  const recipe = await RecipeModel.findById(id);

  if (!recipe) {
    return res.status(404).json({
      message: `La receta con el ${id}, no existe`,
    });
  }

  try {
    await RecipeModel.deleteOne({ _id: id });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }

  return res
    .status(204)
    .json({ message: `Receta con ${id} borrado correctamente` });
};

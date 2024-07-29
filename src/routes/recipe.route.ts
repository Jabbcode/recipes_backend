import { Router } from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
} from "../controllers/recipe.controller";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";

const router = Router();

router.get("/", getAllRecipes);

router.get("/:id", validateObjectIdMiddleware, getRecipeById);

router.post("/", createRecipe);

router.patch("/:id", validateObjectIdMiddleware, updateRecipe);

router.delete("/:id", validateObjectIdMiddleware, deleteRecipe);

export default router;

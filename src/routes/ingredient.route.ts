import { Router } from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
} from "../controllers/ingredient.controller";

const router = Router();

router.get("/", getAllIngredients);

router.get("/:id", getIngredientById);

router.post("/", createIngredient);

router.put("/:id", updateIngredient);

router.delete("/:id", deleteIngredient);

export default router;

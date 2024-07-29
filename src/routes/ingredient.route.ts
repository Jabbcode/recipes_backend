import { Router } from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
} from "../controllers/ingredient.controller";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";

const router = Router();

router.get("/", getAllIngredients);

router.get("/:id", validateObjectIdMiddleware, getIngredientById);

router.post("/", createIngredient);

router.put("/:id", validateObjectIdMiddleware, updateIngredient);

router.delete("/:id", validateObjectIdMiddleware, deleteIngredient);

export default router;

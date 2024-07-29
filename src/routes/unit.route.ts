import { Router } from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
} from "../controllers/unit.controller";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";

const router = Router();

router.get("/", getAllUnits);

router.get("/:id", validateObjectIdMiddleware, getUnitById);

router.post("/", createUnit);

router.put("/:id", validateObjectIdMiddleware, updateUnit);

router.delete("/:id", validateObjectIdMiddleware, deleteUnit);

export default router;

import { Router } from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
} from "../controllers/unit.controller";

const router = Router();

router.get("/", getAllUnits);

router.get("/:id", getUnitById);

router.post("/", createUnit);

router.put("/:id", updateUnit);

router.delete("/:id", deleteUnit);

export default router;

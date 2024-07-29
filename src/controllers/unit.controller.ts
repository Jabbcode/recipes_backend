import { Request, Response } from "express";
import UnitModel from "../models/Unit.model";
import { validateUnitSchema } from "../schemas/validate-unit-schema";
import { validationResult } from "express-validator";

export const getAllUnits = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const units = await UnitModel.find()
    .skip(skip)
    .limit(limitNumber)
    .select(["name", "description"]);

  units.length === 0 && res.status(404);

  const totalUnits = await UnitModel.countDocuments();
  const totalPages = Math.ceil(totalUnits / limitNumber);

  const response = {
    units,
    totalPages,
    totalUnits,
  };

  return res
    .header("Cache-Control", "public, max-age=3600")
    .status(200)
    .json(response);
};

export const getUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const unit = await UnitModel.findById(id).select(["name", "description"]);

  if (!unit) {
    res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  return res.header("ETag", String(unit!._id)).status(200).json(unit);
};

export const createUnit = async (req: Request, res: Response) => {
  await Promise.all(
    validateUnitSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const newUnit = new UnitModel(req.body);
    await newUnit.save();

    return res
      .status(201)
      .json({ message: "La unidad se a creado correctamente", newUnit });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  await Promise.all(
    validateUnitSchema.map((validation) => validation.run(req))
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, description } = req.body;

  const unit = await UnitModel.findById(id);

  if (!unit) {
    return res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  try {
    await UnitModel.updateOne(
      { _id: id },
      {
        name,
        description,
      }
    );
    return res.status(200).json({
      message: "Unidad actualizada con éxito",
      data: { name, description },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  const { id } = req.params;

  const unit = await UnitModel.findById(id);

  if (!unit) {
    res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  try {
    await UnitModel.deleteOne({
      _id: id,
    });

    res.status(204).json({ message: `Unidad con ${id} borrado correctamente` });
  } catch (error) {
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

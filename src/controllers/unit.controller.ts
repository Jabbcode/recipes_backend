import { Request, Response } from "express";
import Unit from "../models/unit.model";

export const getAllUnits = async (req: Request, res: Response) => {
  const units = await Unit.find().select(["name", "description"]);
  units.length === 0 && res.status(404);
  res.status(200).json(units);
};

export const getUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const unit = await Unit.findById(id).select(["name", "description"]);

  if (!unit) {
    res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  res.status(200).json(unit);
};

export const createUnit = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const newUnit = new Unit({ name, description });
  await newUnit.save();

  res.status(201).json(newUnit);
};

export const updateUnit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const unit = await Unit.findById(id);

  if (!unit) {
    res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  const updateUnit = Unit.findByIdAndUpdate(id, {
    name,
    description,
  });

  res.status(200).json(updateUnit);
};

export const deleteUnit = async (req: Request, res: Response) => {
  const { id } = req.params;

  const unit = await Unit.findById(id);

  if (!unit) {
    res.status(404).json({
      message: `La unidad con el ${id}, no existe`,
    });
  }

  await Unit.deleteOne({
    _id: id,
  });

  res.status(204).json({ message: `Unidad con ${id} borrado correctamente` });
};

import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

const validateObjectIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "ID inválido" });
  }
  next();
};

export default validateObjectIdMiddleware;
import mongoose from "mongoose";

export const validateObjectId = (id: string) => {
  return !mongoose.Types.ObjectId.isValid(id);
};

import express from "express";
import cors from "cors";

import { PORT } from "./config";
import dbConfig from "./config/db";
import recipeRouter from "./routes/recipe.route";
import ingredientRouter from "./routes/ingredient.route";
import unitRouter from "./routes/unit.route";

dbConfig;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/ingredients", ingredientRouter);
app.use("/api/v1/units", unitRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

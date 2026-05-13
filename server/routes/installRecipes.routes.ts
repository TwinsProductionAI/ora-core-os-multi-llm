import { Router } from "express";
import { OraDbService } from "../services/oraDb.service.ts";

export const installRecipesRouter = Router();

installRecipesRouter.get("/", (req, res) => {
  res.json(OraDbService.getRecipes());
});

installRecipesRouter.get("/:id", (req, res) => {
  const recipe = OraDbService.getRecipeById(req.params.id);
  if (!recipe) return res.status(404).json({ error: "Installation recipe not found" });
  res.json(recipe);
});

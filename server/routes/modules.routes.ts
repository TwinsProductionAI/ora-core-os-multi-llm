import { Router } from "express";
import { RegistryService } from "../services/registry.service.ts";

export const modulesRouter = Router();

modulesRouter.get("/", (req, res) => {
  res.json(RegistryService.getModules());
});

modulesRouter.get("/:id", (req, res) => {
  const module = RegistryService.getModuleById(req.params.id);
  if (!module) return res.status(404).json({ error: "Module not found" });
  res.json(module);
});

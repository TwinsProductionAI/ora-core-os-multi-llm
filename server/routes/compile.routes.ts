import { Router } from "express";
import { CompilerService } from "../services/compiler.service.ts";

export const compileRouter = Router();

compileRouter.post("/", (req, res) => {
  const { besoin, selectedCapabilityIds } = req.body;
  if (!besoin || !selectedCapabilityIds) return res.status(400).json({ error: "Besoin and capability IDs are required" });
  
  const artifacts = CompilerService.compileArtifacts(besoin, selectedCapabilityIds);
  res.json(artifacts);
});

compileRouter.post("/aletheia-reflect", (req, res) => {
  const { updateId, before } = req.body;
  const reflection = CompilerService.reflectAletheia(updateId, before);
  res.json(reflection);
});

compileRouter.post("/module", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ error: "Name and description are required" });
  
  const result = CompilerService.compileModule(name, description);
  res.json(result);
});

import { Router } from "express";
import { RegistryService } from "../services/registry.service.ts";

export const capabilitiesRouter = Router();

capabilitiesRouter.get("/", (req, res) => {
  res.json(RegistryService.getCapabilities());
});

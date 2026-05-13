import { Router } from "express";
import { AnalyzerService } from "../services/analyzer.service.ts";

export const needsRouter = Router();

needsRouter.post("/analyze", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  
  const analysis = AnalyzerService.analyzeNeeds(text);
  res.json(analysis);
});

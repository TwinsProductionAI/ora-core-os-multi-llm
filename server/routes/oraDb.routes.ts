import { Router } from "express";
import { OraDbService } from "../services/oraDb.service.ts";

export const oraDbRouter = Router();

oraDbRouter.get("/summary", (req, res) => {
  res.json(OraDbService.getSummary());
});

oraDbRouter.get("/files", (req, res) => {
  const { q, kind, extension, packId } = req.query;
  res.json(
    OraDbService.listFiles({
      q: typeof q === "string" ? q : undefined,
      kind: typeof kind === "string" ? kind : undefined,
      extension: typeof extension === "string" ? extension : undefined,
      packId: typeof packId === "string" ? packId : undefined,
    })
  );
});

oraDbRouter.get("/files/:id", (req, res) => {
  const file = OraDbService.getFileById(req.params.id);
  if (!file) return res.status(404).json({ error: "ORA DB file not found" });
  res.json(file);
});

oraDbRouter.get("/packs", (req, res) => {
  res.json(OraDbService.getPacks());
});

oraDbRouter.get("/packs/:id", (req, res) => {
  const pack = OraDbService.getPackById(req.params.id);
  if (!pack) return res.status(404).json({ error: "ORA pack not found" });
  res.json(pack);
});

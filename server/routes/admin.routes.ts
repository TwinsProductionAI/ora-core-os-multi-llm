import { Router } from "express";

export const adminRouter = Router();

adminRouter.post("/session", (req, res) => {
  const configuredPasscode = process.env.ADMIN_PASSCODE;

  if (!configuredPasscode) {
    return res.status(503).json({
      error: "Admin passcode is not configured for this runtime.",
    });
  }

  if (req.body?.passcode !== configuredPasscode) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  res.json({ ok: true, role: "operator" });
});

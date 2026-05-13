import { Router } from "express";
import { modulesRouter } from "./modules.routes.ts";
import { capabilitiesRouter } from "./capabilities.routes.ts";
import { needsRouter } from "./needs.routes.ts";
import { compileRouter } from "./compile.routes.ts";
import { oraDbRouter } from "./oraDb.routes.ts";
import { installRecipesRouter } from "./installRecipes.routes.ts";
import { adminRouter } from "./admin.routes.ts";

export const router = Router();

router.use("/modules", modulesRouter);
router.use("/capabilities", capabilitiesRouter);
router.use("/needs", needsRouter);
router.use("/compile", compileRouter);
router.use("/ora-db", oraDbRouter);
router.use("/install-recipes", installRecipesRouter);
router.use("/admin", adminRouter);

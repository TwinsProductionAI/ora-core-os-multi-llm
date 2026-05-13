import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./routes/index.ts";

export function createApp() {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: false, // For easier integration in iframe
  }));
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/api", router);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  return app;
}

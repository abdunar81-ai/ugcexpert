import { Router } from "express";
import { initDatabase, getDbStatus } from "../db.js";
import { seedInitialData } from "./seed.js";

export const systemRouter = Router();

systemRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

systemRouter.get("/status", (req, res) => {
  const status = getDbStatus();
  res.json({
    status: "ok",
    database: status,
    timestamp: new Date().toISOString()
  });
});

systemRouter.post("/db/init", async (req, res) => {
  const result = await initDatabase();
  if (result.connected) {
    await seedInitialData();
  }
  res.json(result);
});

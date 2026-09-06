import { Router } from "express";
import { 
  getCreatorsList, 
  getActiveCreatorProfile,
  updateCreatorProfileRecord,
  updateGoalRecord 
} from "../db.js";

export const creatorRouter = Router();

creatorRouter.get("/creators", async (req, res) => {
  const creators = await getCreatorsList();
  res.json({ success: true, creators });
});

creatorRouter.get("/creator/profile", async (req, res) => {
  const profile = await getActiveCreatorProfile();
  res.json({ success: true, profile });
});

creatorRouter.put("/creator/profile", async (req, res) => {
  const updates = req.body || {};
  const updated = await updateCreatorProfileRecord(updates);
  res.json({ success: true, profile: updated });
});

creatorRouter.put("/creator/goal", async (req, res) => {
  const goal = req.body;
  if (!goal) return res.status(400).json({ error: "Goal required" });
  const updated = await updateGoalRecord(goal);
  res.json({ success: true, goal: updated });
});

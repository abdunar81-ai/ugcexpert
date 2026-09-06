import { Router } from "express";
import { getCampaignsList, createCampaignRecord } from "../db.js";

export const campaignsRouter = Router();

campaignsRouter.get("/", async (req, res) => {
  const campaigns = await getCampaignsList();
  res.json({ success: true, campaigns });
});

campaignsRouter.post("/", async (req, res) => {
  const newCampaign = req.body;
  if (!newCampaign || !newCampaign.title) {
    return res.status(400).json({ error: "Invalid campaign payload" });
  }
  const created = await createCampaignRecord(newCampaign);
  res.status(201).json({ success: true, campaign: created });
});

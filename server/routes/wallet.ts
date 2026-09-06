import { Router } from "express";
import { getActiveCreatorProfile, requestWithdrawalRecord } from "../db.js";

export const walletRouter = Router();

walletRouter.get("/", async (req, res) => {
  const profile = await getActiveCreatorProfile();
  res.json({ success: true, wallet: profile.wallet });
});

walletRouter.post("/withdraw", async (req, res) => {
  const { amount, method, account } = req.body || {};
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valid amount required" });
  }
  const result = await requestWithdrawalRecord(Number(amount), method, account);
  res.json({ 
    success: true, 
    wallet: result.wallet, 
    transaction: result.transaction 
  });
});

import { Router } from "express";
import { prisma } from "../prisma.js";

export const adminRouter = Router();

// GET /api/admin/withdrawals
adminRouter.get("/withdrawals", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: "withdrawal" },
      orderBy: { date: "desc" },
      include: {
        wallet: {
          include: {
            creator: {
              select: { name: true }
            }
          }
        }
      }
    });

    const withdrawals = transactions.map(tx => ({
      id: tx.id,
      creatorName: tx.wallet.creator?.name || "Белгісіз",
      amount: Math.abs(tx.amount),
      method: tx.paymentMethod || "Белгісіз",
      account: tx.accountNumber || "Белгісіз",
      date: tx.date,
      status: tx.status
    }));

    res.json({ success: true, withdrawals });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

// POST /api/admin/withdrawals/:id/approve
adminRouter.post("/withdrawals/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    
    const tx = await prisma.transaction.findUnique({
      where: { id },
      include: { wallet: true }
    });
    
    if (!tx || tx.type !== 'withdrawal' || tx.status === 'completed') {
      return res.status(400).json({ error: "Invalid transaction" });
    }

    // Update transaction to completed
    await prisma.transaction.update({
      where: { id },
      data: { status: "completed" }
    });

    // Update wallet (pending amount goes down, totalWithdrawn goes up)
    await prisma.wallet.update({
      where: { id: tx.walletId },
      data: {
        pending: { decrement: Math.abs(tx.amount) },
        totalWithdrawn: { increment: Math.abs(tx.amount) }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    res.status(500).json({ error: "Failed to approve withdrawal" });
  }
});

// PUT /api/admin/creators/:id/verify
adminRouter.put("/creators/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    
    const creator = await prisma.creator.findUnique({ where: { id } });
    if (!creator) return res.status(404).json({ error: "Creator not found" });

    const updated = await prisma.creator.update({
      where: { id },
      data: { verified: !creator.verified }
    });
    
    res.json({ success: true, verified: updated.verified });
  } catch (error) {
    console.error("Error verifying creator:", error);
    res.status(500).json({ error: "Failed to verify creator" });
  }
});

// PUT /api/admin/creators/:id/level
adminRouter.put("/creators/:id/level", async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.body;
    
    const updated = await prisma.creator.update({
      where: { id },
      data: { level: Number(level) }
    });
    
    res.json({ success: true, level: updated.level });
  } catch (error) {
    console.error("Error updating creator level:", error);
    res.status(500).json({ error: "Failed to update level" });
  }
});

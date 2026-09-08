import { Router } from "express";
import { prisma } from "../prisma.js";
import { getOrdersList, submitOrderVideoUrl } from "../db.js";

export const ordersRouter = Router();

ordersRouter.get("/", async (req, res) => {
  const orders = await getOrdersList();
  res.json({ success: true, orders });
});

ordersRouter.post("/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { videoUrl } = req.body || {};
  if (!videoUrl) {
    return res.status(400).json({ error: "videoUrl is required" });
  }
  const updatedOrder = await submitOrderVideoUrl(id, videoUrl);
  res.json({ success: true, order: updatedOrder });
});

ordersRouter.post("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "approved" }
  });
  res.json({ success: true, order: updatedOrder });
});

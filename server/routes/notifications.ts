import { Router } from "express";
import { prisma } from "../prisma.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Seed dummy if empty
    if (notifications.length === 0) {
      const dummies = [
        {
          title: 'Жаңа сатылым расталды!',
          description: 'GlowSkin Табиғи бет күтімі бойынша рефералдық сілтемеңізден тапсырыс түсті. +15 000 ₸ әмияныңызға есептелді.',
          time: '15 минут бұрын',
          type: 'sale',
          unread: true,
          userId: 'all',
        },
        {
          title: 'Жаңа UGC Кампания: PowerFuel Pro',
          description: 'Спорттық тағам санатында жаңа жоба іске қосылды. Әр сатылымға 20 000 ₸ комиссия ұсынылады.',
          time: '2 сағат бұрын',
          type: 'campaign',
          unread: true,
          userId: 'all',
        }
      ];
      await prisma.notification.createMany({ data: dummies });
      const newNotes = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }});
      return res.json({ success: true, notifications: newNotes });
    }

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

notificationsRouter.post("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { unread: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to read notification" });
  }
});

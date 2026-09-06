import { prisma } from "../prisma.js";
import { randomBytes } from "crypto";

export async function seedInitialData() {
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  if (adminCount === 0) {
    await prisma.user.create({
      data: {
        email: "admin@ugcexpert.kz",
        password: "admin123", // In a real production, this would be a hash
        name: "Басты Әкімші",
        role: "admin",
      }
    });
  }

  const creatorCount = await prisma.user.count({ where: { role: "creator" } });
  if (creatorCount === 0) {
    const creator = await prisma.creator.findFirst();
    if (creator) {
      await prisma.user.create({
        data: {
          email: "creator@ugcexpert.kz",
          password: "creator123",
          name: "UGC Креатор",
          role: "creator",
          creatorId: creator.id
        }
      });
    }
  }
}

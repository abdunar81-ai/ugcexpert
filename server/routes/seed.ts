import { prisma } from "../prisma.js";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

export async function seedInitialData() {
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  if (adminCount === 0) {
    const adminHashed = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@ugcexpert.kz",
        password: adminHashed,
        name: "Басты Әкімші",
        role: "admin",
      }
    });
  }

  const creatorCount = await prisma.user.count({ where: { role: "creator" } });
  if (creatorCount === 0) {
    const creator = await prisma.creator.findFirst();
    if (creator) {
      const creatorHashed = await bcrypt.hash("creator123", 10);
      await prisma.user.create({
        data: {
          email: "creator@ugcexpert.kz",
          password: creatorHashed,
          name: "UGC Креатор",
          role: "creator",
          creatorId: creator.id
        }
      });
    }
  }
}

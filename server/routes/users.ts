import { Router } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";

export const usersRouter = Router();

// GET /api/users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        creatorId: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /api/users
usersRouter.post("/", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Барлық жолдарды толтырыңыз." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Бұл электрондық пошта (email) тіркелген." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || "creator",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Пайдаланушыны құру сәтсіз аяқталды." });
  }
});

// DELETE /api/users/:id
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Пайдаланушыны өшіру сәтсіз аяқталды." });
  }
});

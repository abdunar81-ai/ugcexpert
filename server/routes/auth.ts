import { Router } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email және құпиясөзді енгізіңіз" });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email немесе құпиясөз қате!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email немесе құпиясөз қате!" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        creatorId: user.creatorId
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Ішкі сервер қатесі" });
  }
});

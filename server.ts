import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { initDatabase } from "./server/db.js";
import { systemRouter } from "./server/routes/system.js";
import { authRouter } from "./server/routes/auth.js";
import { creatorRouter } from "./server/routes/creator.js";
import { campaignsRouter } from "./server/routes/campaigns.js";
import { ordersRouter } from "./server/routes/orders.js";
import { lessonsRouter } from "./server/routes/lessons.js";
import { walletRouter } from "./server/routes/wallet.js";
import { geminiRouter } from "./server/routes/gemini.js";
import { seedInitialData } from "./server/routes/seed.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use("/api", systemRouter);
app.use("/api/auth", authRouter);
app.use("/api", creatorRouter); // /api/creators, /api/creator/profile
app.use("/api/campaigns", campaignsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/gemini", geminiRouter);

// Vite middleware & Static serving
async function startServer() {
  // Attempt Database Connection & Seed
  initDatabase().then(async (res) => {
    if (res.connected) {
      console.log(`[DB] Database connected: ${res.message}`);
      await seedInitialData();
      console.log(`[DB] Initial data seeded`);
    } else {
      console.log(`[DB] Standby mode: ${res.message}`);
    }
  }).catch((err) => {
    console.warn(`[DB] Standby init error:`, err);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UGC EXPERT Server running on http://localhost:${PORT}`);
  });
}

startServer();

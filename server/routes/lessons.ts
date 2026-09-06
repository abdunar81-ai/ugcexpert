import { Router } from "express";
import { getLessonsList, completeLessonModule } from "../db.js";

export const lessonsRouter = Router();

lessonsRouter.get("/", async (req, res) => {
  const lessons = await getLessonsList();
  res.json({ success: true, lessons });
});

lessonsRouter.post("/:id/complete", async (req, res) => {
  const moduleId = parseInt(req.params.id, 10);
  const result = await completeLessonModule(moduleId);
  res.json({ 
    success: true, 
    lessons: result.lessons, 
    newLevel: result.newLevel 
  });
});

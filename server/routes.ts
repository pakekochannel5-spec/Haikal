import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema, insertQuestionSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Basic health endpoint for uptime checks
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/questions", async (_req, res) => {
    try {
      const questions = await storage.getQuestions();
      // Shuffle questions untuk urutan acak setiap kali
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      res.json(shuffled);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil soal" });
    }
  });

  app.post("/api/score", async (req, res) => {
    try {
      const validatedData = insertScoreSchema.parse(req.body);
      const questions = await storage.getQuestions();
      
      if (validatedData.score < 0 || validatedData.score > validatedData.totalQuestions * 10) {
        return res.status(400).json({ error: "Skor tidak valid" });
      }

      const score = await storage.addScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal menyimpan skor" });
    }
  });

  app.get("/api/scores", async (_req, res) => {
    try {
      const scores = await storage.getScores();
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil daftar skor" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      const admin = await storage.validateAdmin(username, password);
      
      if (!admin) {
        return res.status(401).json({ error: "Username atau password salah" });
      }

      req.session.isAdmin = true;
      res.json({ success: true, message: "Login berhasil" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Data tidak valid" });
      }
      res.status(500).json({ error: "Gagal login" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Gagal logout" });
      }
      res.json({ success: true, message: "Logout berhasil" });
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  app.post("/api/admin/questions", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.addQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal menambah soal" });
    }
  });

  app.put("/api/admin/questions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.updateQuestion(id, validatedData);
      
      if (!question) {
        return res.status(404).json({ error: "Soal tidak ditemukan" });
      }
      
      res.json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal mengupdate soal" });
    }
  });

  app.delete("/api/admin/questions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuestion(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Soal tidak ditemukan" });
      }
      
      res.json({ success: true, message: "Soal berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: "Gagal menghapus soal" });
    }
  });

  app.delete("/api/admin/scores/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteScore(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Skor tidak ditemukan" });
      }
      
      res.json({ success: true, message: "Skor berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: "Gagal menghapus skor" });
    }
  });

  app.delete("/api/admin/scores", requireAdmin, async (_req, res) => {
    try {
      await storage.clearScores();
      res.json({ success: true, message: "Semua skor berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: "Gagal menghapus semua skor" });
    }
  });

  return httpServer;
}

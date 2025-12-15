import { z } from "zod";
import { pgTable, serial, text, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Score {
  id: number;
  studentName: string;
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
}

export const insertScoreSchema = z.object({
  studentName: z.string().min(1, "Nama harus diisi").max(100, "Nama terlalu panjang"),
  score: z.number().min(0).max(100),
  totalQuestions: z.number().min(1).max(20),
});

export const insertQuestionSchema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  options: z.array(z.string().min(1)).length(4, "Harus ada 4 pilihan jawaban"),
  correctAnswer: z.number().min(0).max(3, "Jawaban benar harus 0-3"),
});

export const updateQuestionSchema = insertQuestionSchema.extend({
  id: z.number(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

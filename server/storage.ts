import { type Question, type Score, type InsertScore, type InsertQuestion, type Admin, questions, scores } from "@shared/schema";
import { db, hasDatabase } from "./db";
import { eq } from "drizzle-orm";

const defaultQuestions: InsertQuestion[] = [
  {
    question: "Apa yang dimaksud dengan angkatan kerja?",
    options: [
      "Seluruh penduduk dalam suatu negara",
      "Penduduk usia kerja yang bekerja dan sedang mencari pekerjaan",
      "Penduduk yang sudah pensiun",
      "Penduduk yang masih bersekolah"
    ],
    correctAnswer: 1
  },
  {
    question: "Batas usia minimal seseorang untuk masuk angkatan kerja di Indonesia adalah...",
    options: [
      "13 tahun",
      "15 tahun",
      "17 tahun",
      "21 tahun"
    ],
    correctAnswer: 1
  },
  {
    question: "Apa yang dimaksud dengan pengangguran friksional?",
    options: [
      "Pengangguran karena tidak ada lowongan pekerjaan",
      "Pengangguran karena perubahan teknologi",
      "Pengangguran sementara karena sedang mencari pekerjaan yang lebih baik",
      "Pengangguran karena tidak mau bekerja"
    ],
    correctAnswer: 2
  },
  {
    question: "Upah Minimum Regional (UMR) ditetapkan oleh...",
    options: [
      "Presiden",
      "Menteri Tenaga Kerja",
      "Gubernur/Bupati/Walikota",
      "DPR"
    ],
    correctAnswer: 2
  },
  {
    question: "Hak pekerja yang dijamin oleh undang-undang adalah...",
    options: [
      "Bekerja 12 jam sehari tanpa istirahat",
      "Mendapat upah yang layak dan cuti",
      "Tidak boleh membentuk serikat pekerja",
      "Tidak mendapat jaminan kesehatan"
    ],
    correctAnswer: 1
  },
  {
    question: "Apa yang dimaksud dengan tenaga kerja terampil?",
    options: [
      "Tenaga kerja yang tidak memerlukan pendidikan",
      "Tenaga kerja yang memiliki keahlian khusus melalui pendidikan atau pelatihan",
      "Tenaga kerja yang baru lulus sekolah",
      "Tenaga kerja yang bekerja di pemerintahan"
    ],
    correctAnswer: 1
  },
  {
    question: "BPJS Ketenagakerjaan memberikan perlindungan dalam hal...",
    options: [
      "Hanya kecelakaan kerja",
      "Kecelakaan kerja, jaminan hari tua, pensiun, dan kematian",
      "Hanya jaminan pensiun",
      "Hanya asuransi jiwa"
    ],
    correctAnswer: 1
  },
  {
    question: "Pengangguran struktural disebabkan oleh...",
    options: [
      "Pergantian musim",
      "Perubahan struktur ekonomi dan ketidakcocokan keterampilan",
      "Keinginan pribadi untuk tidak bekerja",
      "Liburan panjang"
    ],
    correctAnswer: 1
  },
  {
    question: "Kewajiban pekerja yang benar adalah...",
    options: [
      "Datang kerja sesuka hati",
      "Menaati peraturan perusahaan dan melaksanakan tugas dengan baik",
      "Tidak perlu menjaga kerahasiaan perusahaan",
      "Menolak perintah atasan"
    ],
    correctAnswer: 1
  },
  {
    question: "Tingkat Partisipasi Angkatan Kerja (TPAK) dihitung dengan rumus...",
    options: [
      "Jumlah pengangguran dibagi jumlah penduduk",
      "Jumlah angkatan kerja dibagi penduduk usia kerja dikali 100%",
      "Jumlah pekerja dibagi jumlah pengangguran",
      "Jumlah penduduk dibagi angkatan kerja"
    ],
    correctAnswer: 1
  }
];

export interface IStorage {
  getQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  addQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: InsertQuestion): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;
  getScores(): Promise<Score[]>;
  addScore(score: InsertScore): Promise<Score>;
  deleteScore(id: number): Promise<boolean>;
  clearScores(): Promise<void>;
  validateAdmin(username: string, password: string): Promise<Admin | null>;
  initializeDefaultQuestions(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultQuestions(): Promise<void> {
    if (!hasDatabase) {
      // Nothing to initialize for persistent DB; the in-memory fallback will
      // expose the default questions automatically.
      return;
    }

    try {
      const existingQuestions = await db.select().from(questions);
      if (existingQuestions.length === 0) {
        for (const q of defaultQuestions) {
          await db.insert(questions).values(q);
        }
      }
    } catch (err) {
      // If DB connection fails during initialization, log and continue with
      // in-memory fallback so the serverless function can still respond.
      console.error("Failed to initialize default questions:", err);
      return;
    }
  }

  async getQuestions(): Promise<Question[]> {
    if (!hasDatabase) {
      // Return default questions when no DB is configured so the app remains usable.
      return defaultQuestions.map((q, i) => ({ id: i + 1, ...q }));
    }
    return await db.select().from(questions);
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    if (!hasDatabase) {
      return defaultQuestions.map((q, i) => ({ id: i + 1, ...q })).find((q) => q.id === id);
    }

    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async addQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    if (!hasDatabase) {
      // Not persisted, but return a synthetic question to keep API consistent.
      const questions = defaultQuestions.map((q, i) => ({ id: i + 1, ...q }));
      const id = questions.length + 1;
      const question = { id, ...insertQuestion } as Question;
      return question;
    }

    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }

  async updateQuestion(id: number, insertQuestion: InsertQuestion): Promise<Question | undefined> {
    if (!hasDatabase) {
      const existing = defaultQuestions.map((q, i) => ({ id: i + 1, ...q })).find((q) => q.id === id);
      if (!existing) return undefined;
      return { id, ...insertQuestion } as Question;
    }

    const [question] = await db
      .update(questions)
      .set(insertQuestion)
      .where(eq(questions.id, id))
      .returning();
    return question || undefined;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    if (!hasDatabase) {
      const existing = defaultQuestions.map((q, i) => ({ id: i + 1, ...q })).find((q) => q.id === id);
      return Boolean(existing);
    }
    const result = await db.delete(questions).where(eq(questions.id, id)).returning();
    return result.length > 0;
  }

  async getScores(): Promise<Score[]> {
    if (!hasDatabase) {
      return [];
    }
    const allScores = await db.select().from(scores);
    return allScores.sort((a: Score, b: Score) => b.score - a.score);
  }

  async addScore(insertScore: InsertScore): Promise<Score> {
    if (!hasDatabase) {
      // Return a synthetic score (not persisted) so clients can move forward.
      const score: Score = {
        id: Math.floor(Math.random() * 1000000),
        studentName: insertScore.studentName,
        score: insertScore.score,
        totalQuestions: insertScore.totalQuestions,
        createdAt: new Date(),
      };
      return score;
    }

    const [score] = await db.insert(scores).values(insertScore).returning();
    return score;
  }

  async deleteScore(id: number): Promise<boolean> {
    if (!hasDatabase) {
      return false;
    }
    const result = await db.delete(scores).where(eq(scores.id, id)).returning();
    return result.length > 0;
  }

  async clearScores(): Promise<void> {
    if (!hasDatabase) return;
    await db.delete(scores);
  }

  async validateAdmin(username: string, password: string): Promise<Admin | null> {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set");
      return null;
    }

    if (username === adminUsername && password === adminPassword) {
      return {
        id: "admin-1",
        username: adminUsername,
        password: "[PROTECTED]"
      };
    }
    return null;
  }
}

export const storage = new DatabaseStorage();

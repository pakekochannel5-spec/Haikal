import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Plus, Pencil, Trash2, LogOut, Users, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Score {
  id: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) {
          setLocation("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setLocation("/admin/login"));
  }, [setLocation]);

  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: () => fetch("/api/questions").then((res) => res.json()),
    enabled: isAuthenticated === true,
  });

  const { data: scores = [], isLoading: scoresLoading } = useQuery<Score[]>({
    queryKey: ["scores"],
    queryFn: () => fetch("/api/scores").then((res) => res.json()),
    enabled: isAuthenticated === true,
  });

  const addQuestionMutation = useMutation({
    mutationFn: (data: typeof questionForm) =>
      fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal menambah soal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof questionForm }) =>
      fetch(`/api/admin/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal mengupdate soal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Berhasil", description: "Soal berhasil diupdate" });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/admin/questions/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus soal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Berhasil", description: "Soal berhasil dihapus" });
    },
    onError: (error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const deleteScoreMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/scores/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus skor");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
      toast({ title: "Berhasil", description: "Skor berhasil dihapus" });
    },
    onError: (error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const clearScoresMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/scores", { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus semua skor");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
      toast({ title: "Berhasil", description: "Semua skor berhasil dihapus" });
    },
    onError: (error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setLocation("/");
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setQuestionForm({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
  };

  const openEditDialog = (q: Question) => {
    setEditingQuestion(q);
    setQuestionForm({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, data: questionForm });
    } else {
      addQuestionMutation.mutate(questionForm);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Kelola soal dan skor kuis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="questions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Soal ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="scores" className="gap-2">
              <Users className="w-4 h-4" />
              Skor ({scores.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Soal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingQuestion ? "Edit Soal" : "Tambah Soal Baru"}</DialogTitle>
                    <DialogDescription>
                      {editingQuestion ? "Ubah soal yang sudah ada" : "Buat soal pilihan ganda baru"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pertanyaan</Label>
                      <Input
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                        placeholder="Masukkan pertanyaan"
                      />
                    </div>
                    {questionForm.options.map((opt, idx) => (
                      <div key={idx} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Opsi {String.fromCharCode(65 + idx)}
                          {questionForm.correctAnswer === idx && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Jawaban Benar</span>
                          )}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[idx] = e.target.value;
                              setQuestionForm({ ...questionForm, options: newOptions });
                            }}
                            placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                          />
                          <Button
                            type="button"
                            variant={questionForm.correctAnswer === idx ? "default" : "outline"}
                            size="sm"
                            onClick={() => setQuestionForm({ ...questionForm, correctAnswer: idx })}
                          >
                            Benar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                    <Button onClick={handleSubmit} disabled={addQuestionMutation.isPending || updateQuestionMutation.isPending}>
                      {editingQuestion ? "Update" : "Simpan"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {questionsLoading ? (
              <p className="text-center py-8 text-muted-foreground">Memuat soal...</p>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Belum ada soal. Klik "Tambah Soal" untuk membuat soal baru.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <Card key={q.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                            {q.options.map((opt, optIdx) => (
                              <p key={optIdx} className={q.correctAnswer === optIdx ? "text-green-600 font-medium" : ""}>
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(q)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Soal?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Soal ini akan dihapus permanen dan tidak bisa dikembalikan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteQuestionMutation.mutate(q.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            {scores.length > 0 && (
              <div className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Hapus Semua Skor
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Semua Skor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Semua data skor akan dihapus permanen dan tidak bisa dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => clearScoresMutation.mutate()}>
                        Hapus Semua
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {scoresLoading ? (
              <p className="text-center py-8 text-muted-foreground">Memuat skor...</p>
            ) : scores.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Belum ada skor yang tersimpan.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {scores.map((s, idx) => (
                  <Card key={s.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium">{s.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(s.createdAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-primary">{s.score}/{s.totalQuestions * 10}</p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Skor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Skor dari {s.studentName} akan dihapus permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteScoreMutation.mutate(s.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

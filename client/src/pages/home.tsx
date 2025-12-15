import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      setError("Nama harus diisi");
      return;
    }
    
    if (studentName.trim().length < 2) {
      setError("Nama minimal 2 karakter");
      return;
    }

    sessionStorage.setItem("studentName", studentName.trim());
    setLocation("/challenge");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-title">
            Kuis Ketenagakerjaan
          </h1>
          <p className="text-muted-foreground">
            Uji pengetahuanmu tentang dunia kerja
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Selamat Datang!</CardTitle>
            <CardDescription>
              Masukkan namamu untuk memulai kuis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nama Lengkap</Label>
                <Input
                  id="studentName"
                  type="text"
                  placeholder="Masukkan nama lengkapmu"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setError("");
                  }}
                  data-testid="input-student-name"
                  className={error ? "border-destructive" : ""}
                />
                {error && (
                  <p className="text-sm text-destructive" data-testid="text-error">
                    {error}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                data-testid="button-start-quiz"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Mulai Kuis
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">10</div>
                  <div className="text-xs text-muted-foreground">Soal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">+10</div>
                  <div className="text-xs text-muted-foreground">Per Jawaban</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100</div>
                  <div className="text-xs text-muted-foreground">Skor Max</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/scores")}
            className="text-muted-foreground"
            data-testid="link-view-scores"
          >
            <Users className="w-4 h-4 mr-2" />
            Lihat Daftar Skor
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Trophy, Medal, Award, Users } from "lucide-react";
import type { Score } from "@shared/schema";

export default function Scores() {
  const [, setLocation] = useLocation();

  const { data: scores, isLoading, error } = useQuery<Score[]>({
    queryKey: ["/api/scores"],
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const formatDate = (dateInput: string | Date) => {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-title">
              <Users className="w-6 h-6" />
              Daftar Skor
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Lihat skor semua siswa yang telah mengerjakan kuis
            </p>
          </div>
          <Button onClick={() => setLocation("/home")} data-testid="button-new-quiz">
            <Home className="w-4 h-4 mr-2" />
            Kuis Baru
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Papan Peringkat</CardTitle>
            <CardDescription>
              Diurutkan berdasarkan skor tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Gagal memuat data skor</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Coba Lagi
                </Button>
              </div>
            ) : scores && scores.length > 0 ? (
              <div className="space-y-2">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-1">No.</div>
                  <div className="col-span-5">Nama Siswa</div>
                  <div className="col-span-2 text-center">Skor</div>
                  <div className="col-span-4 text-right">Waktu</div>
                </div>
                {scores.map((score, index) => (
                  <div
                    key={score.id}
                    className={`grid grid-cols-12 gap-4 p-3 rounded-md items-center ${
                      index < 3 ? "bg-primary/5" : index % 2 === 0 ? "bg-muted/30" : ""
                    }`}
                    data-testid={`row-score-${index}`}
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      {getRankIcon(index) || (
                        <span className="text-muted-foreground font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-11 sm:col-span-5">
                      <span className="font-medium text-foreground" data-testid={`text-name-${index}`}>
                        {score.studentName}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-2 text-left sm:text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary" data-testid={`text-score-${index}`}>
                        {score.score} poin
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-4 text-right text-sm text-muted-foreground">
                      {formatDate(score.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Belum Ada Skor
                </h3>
                <p className="text-muted-foreground mb-4">
                  Jadilah yang pertama mengerjakan kuis!
                </p>
                <Button onClick={() => setLocation("/home")} data-testid="button-start-first">
                  Mulai Kuis Sekarang
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

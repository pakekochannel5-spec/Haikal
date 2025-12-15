import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Question } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentName = sessionStorage.getItem("studentName");

  useEffect(() => {
    if (!studentName) {
      setLocation("/home");
    }
  }, [studentName, setLocation]);

  const { data: questions, isLoading, error } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { studentName: string; score: number; totalQuestions: number }) => {
      return apiRequest("POST", "/api/score", data);
    },
    onSuccess: (_, variables) => {
      sessionStorage.setItem("quizResult", JSON.stringify({
        studentName: variables.studentName,
        score: variables.score,
        totalQuestions: variables.totalQuestions,
      }));
      setLocation("/result");
    },
  });

  if (!studentName) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">Gagal memuat soal. Silakan coba lagi.</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[question.id];

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 10;
      }
    });

    submitMutation.mutate({
      studentName,
      score,
      totalQuestions,
    });
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground" data-testid="text-progress">
                Soal {currentQuestion + 1} dari {totalQuestions}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {studentName}
              </span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-bar" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl leading-relaxed" data-testid="text-question">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full p-4 text-left rounded-md border transition-colors flex items-center gap-3 hover-elevate active-elevate-2 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`button-option-${index}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={isSelected ? "font-medium" : ""}>
                      {option}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              data-testid="button-previous"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting || submitMutation.isPending}
                data-testid="button-submit"
              >
                {isSubmitting || submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Selesai & Lihat Hasil"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === undefined}
                data-testid="button-next"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = index === currentQuestion;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isAnswered
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`button-nav-${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Intro from "@/pages/intro";
import Home from "@/pages/home";
import Challenge from "@/pages/challenge";
import Quiz from "@/pages/quiz";
import Result from "@/pages/result";
import Scores from "@/pages/scores";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/home" component={Home} />
      <Route path="/challenge" component={Challenge} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/result" component={Result} />
      <Route path="/scores" component={Scores} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

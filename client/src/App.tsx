import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { DetectiveGame } from "./pages/DetectiveGame";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DetectiveGame} />
      <Route path="/cipher-cat-office" component={DetectiveGame} />
      <Route path="/cipher-cat-office/" component={DetectiveGame} />
      <Route path="/404" component={NotFound} />
      <Route component={DetectiveGame} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;

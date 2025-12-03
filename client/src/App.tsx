import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthGuard from "./components/AuthGuard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import RecordReading from "./pages/RecordReading";
import CompletedBooks from "./pages/CompletedBooks";
import BookNotes from "./pages/BookNotes";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      {/* 공개 라우트 */}
      <Route path="/login" component={Login} />

      {/* 인증 필요 라우트 */}
      <Route path="/">
        <AuthGuard>
          <Home />
        </AuthGuard>
      </Route>
      <Route path="/add-book">
        <AuthGuard>
          <AddBook />
        </AuthGuard>
      </Route>
      <Route path="/record/:bookId">
        <AuthGuard>
          <RecordReading />
        </AuthGuard>
      </Route>
      <Route path="/completed">
        <AuthGuard>
          <CompletedBooks />
        </AuthGuard>
      </Route>
      <Route path="/book-notes/:bookId">
        <AuthGuard>
          <BookNotes />
        </AuthGuard>
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

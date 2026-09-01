import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthCallback } from "@/components/AuthCallback";
import Home from "@/pages/Home";
import Openings from "@/pages/Openings";
import OpeningDetail from "@/pages/OpeningDetail";
import Lessons from "@/pages/Lessons";
import LessonPlayer from "@/pages/LessonPlayer";
import Tactics from "@/pages/Tactics";
import TacticTrainer from "@/pages/TacticTrainer";
import Puzzles from "@/pages/Puzzles";
import ProgressPage from "@/pages/ProgressPage";
import Sandbox from "@/pages/Sandbox";
import Login from "@/pages/Login";
import ScrollToTop from "@/components/ScrollToTop";

function AppShell() {
  const location = useLocation();
  // Handle Emergent OAuth callback FIRST (synchronously during render) to avoid race conditions
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/openings" element={<Openings />} />
          <Route path="/openings/:id" element={<OpeningDetail />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonPlayer />} />
          <Route path="/tactics" element={<Tactics />} />
          <Route path="/tactics/:id" element={<TacticTrainer />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/board" element={<Sandbox />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <TooltipProvider delayDuration={150}>
            <BrowserRouter>
              <ScrollToTop />
              <AppShell />
              <Toaster position="top-center" richColors closeButton />
            </BrowserRouter>
          </TooltipProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

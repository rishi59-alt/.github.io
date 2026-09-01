import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 8.8-4.1 8.8-6.2 0-.7-.1-1.2-.2-1.7H12z"/>
    </svg>
  );
}

export default function Login() {
  const { login, register, googleLogin } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === "login") {
        const u = await login(email, password);
        toast.success(`Welcome back, ${u.name}. Your Move.`);
      } else {
        const u = await register(email, password, name);
        toast.success(`Account created. Time to Grind, ${u.name}.`);
      }
      try { await progress.refresh(); } catch (_) {}
      navigate("/progress");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Try again.";
      toast.error(typeof msg === "string" ? msg : "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="absolute inset-0 hero-checkerboard" />
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border/70 bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8"
      >
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back home</Link>
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-display text-lg font-bold">♟</span>
          <div>
            <div className="font-display text-xl font-bold leading-none">CHESS</div>
            <div className="text-xs text-muted-foreground">Save your progress. Level up anywhere.</div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="auth-tab-login">Log in</TabsTrigger>
            <TabsTrigger value="signup" data-testid="auth-tab-signup">Sign up</TabsTrigger>
          </TabsList>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <TabsContent value="signup" className="m-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" placeholder="Magnus" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" data-testid="auth-name-input" />
                </div>
              </div>
            </TabsContent>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" data-testid="auth-email-input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required minLength={6} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" data-testid="auth-password-input" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-action hover:brightness-110" disabled={busy} data-testid="auth-submit-button">
              {busy ? "Please wait…" : tab === "login" ? "Log in" : "Create account"}
            </Button>
          </form>
        </Tabs>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={googleLogin} data-testid="google-login-button">
          <GoogleIcon /> <span className="ml-2">Continue with Google</span>
        </Button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can keep playing without an account — <Link to="/" className="text-action hover:underline">just start learning</Link>.
        </p>
      </motion.div>
    </div>
  );
}

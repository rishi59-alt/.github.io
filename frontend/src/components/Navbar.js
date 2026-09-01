import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, Flame, Sun, Moon, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/context/ThemeContext";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn, LayoutDashboard } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/openings", label: "Openings" },
  { to: "/lessons", label: "Lessons" },
  { to: "/tactics", label: "Tactics" },
  { to: "/puzzles", label: "Puzzles" },
  { to: "/board", label: "Board" },
  { to: "/progress", label: "Progress" },
];

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2" data-testid="brand-logo">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-display text-lg font-bold">♟</span>
      <span className="font-display text-xl font-bold tracking-tight">CHESS</span>
    </Link>
  );
}

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { progress, refresh } = useProgress();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    try { await refresh(); } catch (e) { /* noop */ }
    navigate("/");
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const streak = progress?.streak ?? 0;
  const level = progress?.level ?? 1;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-md" data-testid="top-nav">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-6">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) => cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            data-testid="global-search-button"
            className="hidden items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] md:inline">⌘K</kbd>
          </button>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(true)} data-testid="global-search-button-mobile" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>

          <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-2.5 py-1 sm:flex" data-testid="streak-indicator">
            <Flame className={cn("h-4 w-4", streak > 0 ? "text-amber-400" : "text-muted-foreground")} />
            <span className="text-sm font-semibold tabular-nums" data-testid="streak-count">{streak}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggle} data-testid="theme-toggle" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="profile-button"
                  className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-1.5 py-1 pr-3 transition-colors hover:bg-accent/60 sm:flex"
                >
                  <Avatar className="h-6 w-6">
                    {user.picture ? <AvatarImage src={user.picture} alt={user.name} /> : null}
                    <AvatarFallback className="bg-action/15 text-[11px] font-bold text-action">
                      {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[110px] truncate text-xs font-semibold">{user.name || user.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="truncate">{user.name}</div>
                  <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-normal text-action"><Crown className="h-3 w-3" /> Level {level}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/progress")} data-testid="menu-progress"><LayoutDashboard className="mr-2 h-4 w-4" /> My Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={doLogout} data-testid="logout-button"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")} data-testid="login-button">
              <LogIn className="mr-1.5 h-4 w-4" /> Log in
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="mobile-menu-button" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader><SheetTitle><Brand onClick={() => setMobileOpen(false)} /></SheetTitle></SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setMobileOpen(false)}
                    data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                    className={({ isActive }) => cn(
                      "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent/60"
                    )}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-border/70 p-3">
                <span className="inline-flex items-center gap-2 text-sm"><Flame className="h-4 w-4 text-amber-400" /> {streak} day streak</span>
                <span className="inline-flex items-center gap-2 text-sm"><User className="h-4 w-4" /> Lvl {level}</span>
              </div>
              <div className="mt-3">
                {user ? (
                  <Button variant="secondary" className="w-full" onClick={() => { setMobileOpen(false); doLogout(); }} data-testid="mobile-logout-button">
                    <LogOut className="mr-1.5 h-4 w-4" /> Log out ({user.name || user.email})
                  </Button>
                ) : (
                  <Button className="w-full bg-action hover:brightness-110" onClick={() => { setMobileOpen(false); navigate("/login"); }} data-testid="mobile-login-button">
                    <LogIn className="mr-1.5 h-4 w-4" /> Log in / Sign up
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </header>
  );
}

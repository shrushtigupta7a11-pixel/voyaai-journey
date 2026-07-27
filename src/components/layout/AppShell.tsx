import { Link, useLocation, useNavigate, useRouteContext } from "@tanstack/react-router";
import {
  Compass, LayoutDashboard, Map, MessageCircle, Package, Wallet,
  Globe2, Plane, LogOut, Menu, X, Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeToggle } from "./PublicNav";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/planner", icon: Sparkles, label: "AI Trip Planner" },
  { to: "/chat", icon: MessageCircle, label: "AI Concierge" },
  { to: "/trips", icon: Plane, label: "My Trips" },
  { to: "/packing", icon: Package, label: "Packing" },
  { to: "/expenses", icon: Wallet, label: "Expenses" },
  { to: "/currency", icon: Globe2, label: "Currency" },
  { to: "/discover", icon: Map, label: "Discover" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const initial = (user.user_metadata?.display_name || user.email || "?")[0].toUpperCase();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-sidebar p-6 md:flex md:flex-col">
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-2xl">
          <Compass className="size-5 text-primary" /> Voya<span className="text-primary">AI</span>
        </Link>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">{initial}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user.user_metadata?.display_name || user.email}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground" aria-label="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 py-3 md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-xl">
          <Compass className="size-5 text-primary" /> VoyaAI
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 top-14 z-30 bg-background/95 backdrop-blur md:hidden overflow-auto">
          <nav className="p-6 flex flex-col gap-1">
            {nav.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-base hover:bg-muted">
                <Icon className="size-4" /> {label}
              </Link>
            ))}
            <button onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-muted-foreground hover:bg-muted"><LogOut className="size-4" /> Sign out</button>
          </nav>
        </div>
      )}

      <main className="md:pl-64">
        <div className="hidden md:flex justify-end px-8 pt-6"><ThemeToggle /></div>
        <div className="px-4 py-6 md:px-10 md:py-8">{children}</div>
      </main>
    </div>
  );
}

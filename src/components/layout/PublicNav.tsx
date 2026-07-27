import { Link } from "@tanstack/react-router";
import { Compass, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => {
        const el = document.documentElement;
        const next = !el.classList.contains("dark");
        el.classList.toggle("dark", next);
        try {
          localStorage.setItem("voya-theme", next ? "dark" : "light");
        } catch {}
        setDark(next);
      }}
      className="grid size-9 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition hover:text-foreground"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function PublicNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 shadow-soft">
        <Link to="/" className="flex items-center gap-2 pl-2 font-display text-xl">
          <Compass className="size-5 text-primary" />
          <span>Voya<span className="text-primary">AI</span></span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#destinations" className="hover:text-foreground">Destinations</a>
          <a href="#features" className="hover:text-foreground">AI Features</a>
          <a href="#testimonials" className="hover:text-foreground">Stories</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Sign in
          </Link>
          <Link to="/auth">
            <Button size="sm" className="rounded-full px-4">Get started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

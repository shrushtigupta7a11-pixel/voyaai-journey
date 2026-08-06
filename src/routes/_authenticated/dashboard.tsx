import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, MessageCircle, Plane, Package, Wallet, Globe2, MapPin,
  ArrowUpRight, Compass, Sun, TrendingUp, Heart, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = (uid: string) => queryOptions({
  queryKey: ["dashboard", uid],
  queryFn: async () => {
    const [trips, expenses, threads, favs] = await Promise.all([
      supabase.from("trips").select("id,title,destination,start_date,end_date,cover_image_url,status").order("created_at", { ascending: false }).limit(6),
      supabase.from("expenses").select("amount,currency,category").limit(200),
      supabase.from("chat_threads").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("favorites").select("id,name,country").limit(6),
    ]);
    const totalSpent = (expenses.data ?? []).reduce((s, e) => s + Number(e.amount || 0), 0);
    return {
      trips: trips.data ?? [],
      totalSpent,
      threads: threads.data ?? [],
      favs: favs.data ?? [],
      expenseCount: (expenses.data ?? []).length,
    };
  },
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(stats(context.user.id)),
  component: Dashboard,
  head: () => ({ meta: [
    { title: "Dashboard — VoyaAI" },
    { name: "description", content: "Your trips, budgets, and AI travel tools." },
    { property: "og:title", content: "Dashboard — VoyaAI" },
    { property: "og:description", content: "Your travel command center." },
  ] }),
});

const QUICK = [
  { to: "/planner", icon: Sparkles, label: "AI Trip Planner", desc: "Custom itineraries", grad: "linear-gradient(135deg, oklch(0.55 0.15 235), oklch(0.62 0.16 200))", tint: "oklch(0.95 0.05 235)" },
  { to: "/packing", icon: Package, label: "Smart Packing", desc: "Auto-generated lists", grad: "linear-gradient(135deg, oklch(0.7 0.18 32), oklch(0.72 0.17 55))", tint: "oklch(0.95 0.06 40)" },
  { to: "/expenses", icon: Wallet, label: "Expense Tracker", desc: "Track your spend", grad: "linear-gradient(135deg, oklch(0.62 0.17 160), oklch(0.72 0.16 180))", tint: "oklch(0.94 0.06 160)" },
  { to: "/currency", icon: Globe2, label: "Currency", desc: "Live conversion", grad: "linear-gradient(135deg, oklch(0.6 0.2 300), oklch(0.7 0.17 330))", tint: "oklch(0.95 0.06 310)" },
] as const;

function Dashboard() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const { data } = useSuspenseQuery(stats(user.id));
  const name = user.user_metadata?.display_name || (user.email ?? "").split("@")[0];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border shadow-luxury">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, oklch(0.42 0.14 260) 0%, oklch(0.55 0.15 235) 45%, oklch(0.7 0.18 32) 100%)" }} />
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

        <div className="relative grid gap-8 p-8 md:grid-cols-[1.5fr_1fr] md:p-12">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sun className="size-3.5" /> Tuesday, ready to explore
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">
              Welcome back,<br />
              <span className="italic text-white/90">{name}.</span>
            </h1>
            <p className="mt-4 max-w-lg text-white/85">
              Your next journey is a conversation away. Plan smarter, pack lighter, and travel with a concierge in your pocket.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/planner">
                <Button size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg">
                  <Sparkles className="mr-2 size-4" /> Plan a new trip
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  <MessageCircle className="mr-2 size-4" /> Ask the AI
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="relative hidden md:block">
            <div className="absolute right-0 top-0 w-56 rounded-2xl border border-white/25 bg-white/15 p-4 text-white backdrop-blur-xl shadow-luxury animate-float">
              <div className="flex items-center gap-2 text-xs opacity-80"><Plane className="size-3.5" /> Upcoming trips</div>
              <div className="mt-1 font-display text-4xl">{data.trips.length}</div>
              <div className="mt-1 text-xs opacity-75">Ready when you are</div>
            </div>
            <div className="absolute bottom-2 right-24 w-56 rounded-2xl border border-white/25 bg-white/15 p-4 text-white backdrop-blur-xl shadow-luxury animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-2 text-xs opacity-80"><Wallet className="size-3.5" /> Tracked spend</div>
              <div className="mt-1 font-display text-4xl">₹{Math.round(data.totalSpent).toLocaleString()}</div>
              <div className="mt-1 text-xs opacity-75">{data.expenseCount} entries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl">Jump right in</h2>
            <p className="text-sm text-muted-foreground">Your favorite tools, one tap away.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK.map(({ to, icon: Icon, label, desc, grad, tint }) => (
            <Link key={to} to={to}
              className="group relative overflow-hidden rounded-3xl border border-border p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-luxury"
              style={{ background: tint }}>
              <div className="grid size-12 place-items-center rounded-2xl text-white shadow-soft" style={{ background: grad }}>
                <Icon className="size-5" />
              </div>
              <div className="mt-4 font-display text-xl text-foreground">{label}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
              <ArrowUpRight className="absolute right-5 top-5 size-5 text-foreground/40 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming trips */}
        <section className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl">Upcoming journeys</h2>
              <p className="text-sm text-muted-foreground">Your itineraries, curated.</p>
            </div>
            <Link to="/trips" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {data.trips.length === 0 ? (
            <div className="mt-6 rounded-3xl border-2 border-dashed border-border p-10 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Plane className="size-6" />
              </div>
              <p className="mt-4 font-display text-xl">No trips yet</p>
              <p className="text-sm text-muted-foreground">Let the AI plan your first adventure in seconds.</p>
              <Link to="/planner">
                <Button className="mt-5 rounded-full">
                  <Plus className="mr-2 size-4" /> Plan a trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {data.trips.map((t, i) => (
                <Link key={t.id} to="/trips/$tripId" params={{ tripId: t.id }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-luxury">
                  <div className="relative h-32 overflow-hidden bg-muted">
                    <img
                      src={t.cover_image_url || destinationImage(t.destination, i)}
                      alt={`${t.destination} — ${t.title}`}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = destinationImage(t.destination, i); }}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur">
                      {t.status || "planned"}
                    </span>
                    <div className="absolute inset-x-3 bottom-2 text-white">
                      <div className="font-display text-lg leading-tight drop-shadow">{t.title}</div>
                      <div className="flex items-center gap-1 text-[11px] opacity-90">
                        <MapPin className="size-3" /> {t.destination}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          )}
        </section>

        {/* Right column */}
        <div className="space-y-6">
          {/* Spend card */}
          <section className="relative overflow-hidden rounded-3xl p-6 text-white shadow-luxury md:p-7"
            style={{ background: "linear-gradient(135deg, oklch(0.42 0.14 260), oklch(0.55 0.15 235) 60%, oklch(0.7 0.18 32))" }}>
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
                  <TrendingUp className="size-3.5" /> Travel spend
                </div>
                <Wallet className="size-5 opacity-80" />
              </div>
              <div className="mt-5 font-display text-5xl">₹{Math.round(data.totalSpent).toLocaleString()}</div>
              <p className="mt-1 text-sm opacity-85">Across {data.expenseCount} logged entries</p>

              {/* faux bars */}
              <div className="mt-5 flex h-10 items-end gap-1.5">
                {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, idx) => (
                  <div key={idx} className="flex-1 rounded-sm bg-white/70" style={{ height: `${h}%` }} />
                ))}
              </div>

              <Link to="/expenses">
                <Button variant="secondary" className="mt-5 w-full rounded-full bg-white text-foreground hover:bg-white/90">
                  <Plus className="mr-2 size-4" /> Log expense
                </Button>
              </Link>
            </div>
          </section>

          {/* Recent chats */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Recent chats</h2>
              <Link to="/chat" className="text-sm font-medium text-primary hover:underline">Open</Link>
            </div>
            <ul className="mt-4 space-y-1.5">
              {data.threads.length === 0 && (
                <li className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  No conversations yet. Start chatting with your concierge.
                </li>
              )}
              {data.threads.map((t) => (
                <li key={t.id}>
                  <Link to="/chat/$threadId" params={{ threadId: t.id }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <MessageCircle className="size-4" />
                    </div>
                    <span className="flex-1 truncate">{t.title}</span>
                    <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Favorites */}
          {data.favs.length > 0 && (
            <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Heart className="size-4 text-accent" />
                <h2 className="font-display text-2xl">Saved places</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.favs.map((f) => (
                  <span key={f.id} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs">
                    <Compass className="size-3 text-primary" /> {f.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

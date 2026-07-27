import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, MessageCircle, Plane, Package, Wallet, CloudSun, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = (uid: string) => queryOptions({
  queryKey: ["dashboard", uid],
  queryFn: async () => {
    const [trips, expenses, threads, favs] = await Promise.all([
      supabase.from("trips").select("id,title,destination,start_date,end_date,cover_image_url,status").order("created_at", { ascending: false }).limit(6),
      supabase.from("expenses").select("amount,currency").limit(200),
      supabase.from("chat_threads").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("favorites").select("id,name,country").limit(6),
    ]);
    const totalSpent = (expenses.data ?? []).reduce((s, e) => s + Number(e.amount || 0), 0);
    return {
      trips: trips.data ?? [],
      totalSpent,
      threads: threads.data ?? [],
      favs: favs.data ?? [],
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

function Dashboard() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const { data } = useSuspenseQuery(stats(user.id));
  const name = user.user_metadata?.display_name || (user.email ?? "").split("@")[0];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="rounded-3xl gradient-hero p-8 text-primary-foreground shadow-luxury">
        <p className="opacity-80 text-sm">Good to see you</p>
        <h1 className="font-display text-4xl md:text-5xl mt-1">Welcome back, {name}.</h1>
        <p className="mt-3 opacity-90 max-w-lg">Where shall we wander next? Kick off a plan or ask your concierge anything.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/planner"><Button variant="secondary" className="rounded-full"><Sparkles className="mr-2 size-4"/>Plan a new trip</Button></Link>
          <Link to="/chat"><Button variant="outline" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"><MessageCircle className="mr-2 size-4"/>Ask the AI</Button></Link>
        </div>
      </section>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/planner", icon: Sparkles, label: "AI Trip Planner", desc: "Custom itineraries" },
          { to: "/packing", icon: Package, label: "Smart Packing", desc: "Auto-generated lists" },
          { to: "/expenses", icon: Wallet, label: "Expense Tracker", desc: "Track your spend" },
          { to: "/currency", icon: CloudSun, label: "Currency", desc: "Live conversion" },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="group rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-luxury">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5"/></div>
            <div className="mt-3 font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming trips */}
        <section className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Upcoming trips</h2>
            <Link to="/trips" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {data.trips.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <Plane className="mx-auto size-8 opacity-40" />
              <p className="mt-2">No trips yet. Start planning your first adventure.</p>
              <Link to="/planner"><Button className="mt-4 rounded-full">Plan a trip</Button></Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {data.trips.map(t => (
                <Link key={t.id} to="/trips/$tripId" params={{ tripId: t.id }} className="flex items-center justify-between py-3 hover:bg-muted rounded-xl px-2 -mx-2">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3"/>{t.destination}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground"/>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Budget + Recent chats */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl">Travel spend</h2>
            <div className="mt-4 font-display text-4xl text-primary">${data.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across your logged expenses</p>
            <Link to="/expenses"><Button variant="outline" className="mt-4 w-full rounded-full">Log expense</Button></Link>
          </section>
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Recent chats</h2>
              <Link to="/chat" className="text-sm text-primary hover:underline">Open</Link>
            </div>
            <ul className="mt-3 space-y-2">
              {data.threads.length === 0 && <li className="text-sm text-muted-foreground">No conversations yet.</li>}
              {data.threads.map(t => (
                <li key={t.id}>
                  <Link to="/chat/$threadId" params={{ threadId: t.id }} className="block truncate rounded-xl px-3 py-2 text-sm hover:bg-muted">{t.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

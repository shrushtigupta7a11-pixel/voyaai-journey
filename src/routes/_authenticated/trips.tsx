import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plane, Sparkles, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/trips")({
  component: Trips,
  head: () => ({ meta: [
    { title: "My Trips — VoyaAI" },
    { name: "description", content: "Manage every trip you've planned with VoyaAI." },
    { property: "og:title", content: "My Trips — VoyaAI" },
    { property: "og:description", content: "All your journeys, one place." },
  ] }),
});

type Trip = { id: string; title: string; destination: string; status: string; start_date: string | null; end_date: string | null; budget: number | null; currency: string };

function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    supabase.from("trips").select("id,title,destination,status,start_date,end_date,budget,currency").order("created_at", { ascending: false }).then(({ data }) => setTrips((data ?? []) as Trip[]));
  }, []);
  async function del(id: string) {
    if (!confirm("Delete this trip?")) return;
    await supabase.from("trips").delete().eq("id", id);
    setTrips(t => t.filter(x => x.id !== id));
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">My trips</h1>
          <p className="mt-2 text-muted-foreground">Every journey you've planned with VoyaAI.</p>
        </div>
        <Link to="/planner"><Button className="rounded-full"><Sparkles className="mr-2 size-4"/>New trip</Button></Link>
      </div>
      {trips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <Plane className="mx-auto size-10 opacity-40"/>
          <p className="mt-3 text-muted-foreground">No trips yet.</p>
          <Link to="/planner"><Button className="mt-4 rounded-full">Plan your first trip</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map(t => (
            <div key={t.id} className="group rounded-3xl border border-border bg-card p-6 shadow-soft hover:shadow-luxury transition">
              <div className="text-xs uppercase tracking-widest text-accent font-semibold">{t.status}</div>
              <h3 className="mt-1 font-display text-2xl">{t.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-3"/>{t.destination}</p>
              {t.budget && <p className="text-sm mt-3">Budget: <span className="font-semibold">{t.budget} {t.currency}</span></p>}
              <div className="mt-4 flex gap-2">
                <Link to="/trips/$tripId" params={{ tripId: t.id }} className="flex-1"><Button variant="outline" className="w-full rounded-full">Open</Button></Link>
                <Button variant="ghost" onClick={() => del(t.id)} className="rounded-full text-destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

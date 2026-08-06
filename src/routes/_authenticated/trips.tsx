import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plane, Sparkles, MapPin, Calendar, Trash2, ArrowUpRight } from "lucide-react";
import { destinationImage } from "@/lib/destination-images";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/trips")({
  component: Trips,
  head: () => ({ meta: [
    { title: "My Trips — VoyaAI" },
    { name: "description", content: "Manage every trip you've planned with VoyaAI." },
    { property: "og:title", content: "My Trips — VoyaAI" },
    { property: "og:description", content: "All your journeys, one place." },
  ] }),
});

type Trip = { id: string; title: string; destination: string; status: string; start_date: string | null; end_date: string | null; budget: number | null; currency: string; cover_image_url: string | null };

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : null;
}

function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("trips")
      .select("id,title,destination,status,start_date,end_date,budget,currency,cover_image_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setTrips((data ?? []) as Trip[]); setLoading(false); });
  }, []);

  async function del(id: string) {
    if (!confirm("Delete this trip?")) return;
    const prev = trips;
    setTrips((t) => t.filter((x) => x.id !== id));
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) { setTrips(prev); toast.error("Could not delete trip"); }
    else toast.success("Trip deleted");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">My trips</h1>
          <p className="mt-2 text-muted-foreground">Every journey you've planned with VoyaAI.</p>
        </div>
        <Link to="/planner"><Button className="rounded-full"><Sparkles className="mr-2 size-4" />New trip</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-border bg-muted/50" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-16 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Plane className="size-6" /></div>
          <p className="mt-4 font-display text-2xl">No trips yet</p>
          <p className="text-sm text-muted-foreground">Let the AI build your first itinerary in seconds.</p>
          <Link to="/planner"><Button className="mt-5 rounded-full">Plan your first trip</Button></Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((t, i) => {
            const start = fmt(t.start_date), end = fmt(t.end_date);
            return (
              <div key={t.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-luxury">
                <Link to="/trips/$tripId" params={{ tripId: t.id }} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={t.cover_image_url || destinationImage(t.destination, i)}
                      alt={`${t.destination} — ${t.title}`}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = destinationImage(t.destination, i); }}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                      {t.status}
                    </span>
                    <ArrowUpRight className="absolute right-4 top-4 size-5 text-white/80 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    <div className="absolute inset-x-4 bottom-3 text-white">
                      <h3 className="font-display text-2xl leading-tight drop-shadow">{t.title}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs opacity-90"><MapPin className="size-3" />{t.destination}</p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    {start && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3" />{start}{end ? ` – ${end}` : ""}
                      </p>
                    )}
                    {t.budget != null && (
                      <p className="mt-0.5 text-sm font-semibold">
                        {t.currency === "INR" ? "₹" : ""}{Number(t.budget).toLocaleString()} {t.currency !== "INR" ? t.currency : ""}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => del(t.id)} aria-label={`Delete ${t.title}`}
                    className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

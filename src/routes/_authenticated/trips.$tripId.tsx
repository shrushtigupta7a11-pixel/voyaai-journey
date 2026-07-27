import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MapPin } from "lucide-react";

type Trip = { id: string; title: string; destination: string; notes: string | null; budget: number | null; currency: string; travelers: number };
type Day = { id: string; day_number: number; title: string | null; morning: string | null; afternoon: string | null; evening: string | null; tips: string | null; estimated_cost: number | null };

export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  component: TripDetail,
});

function TripDetail() {
  const { tripId } = useParams({ from: "/_authenticated/trips/$tripId" });
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  useEffect(() => {
    supabase.from("trips").select("*").eq("id", tripId).single().then(({ data }) => setTrip(data as any));
    supabase.from("itineraries").select("*").eq("trip_id", tripId).order("day_number").then(({ data }) => setDays((data ?? []) as Day[]));
  }, [tripId]);
  if (!trip) return <div className="text-muted-foreground">Loading…</div>;
  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/>All trips</Link>
      <div>
        <h1 className="font-display text-5xl">{trip.title}</h1>
        <p className="text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-4"/>{trip.destination}</p>
        {trip.notes && <p className="mt-4 text-foreground/80">{trip.notes}</p>}
      </div>
      <div className="space-y-4">
        {days.length === 0 && <p className="text-muted-foreground">No itinerary yet.</p>}
        {days.map(d => (
          <div key={d.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">Day {d.day_number} — {d.title}</h3>
              {d.estimated_cost != null && <span className="text-sm text-muted-foreground">≈ {d.estimated_cost} {trip.currency}</span>}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Morning</div><p className="mt-1 text-sm">{d.morning}</p></div>
              <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Afternoon</div><p className="mt-1 text-sm">{d.afternoon}</p></div>
              <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Evening</div><p className="mt-1 text-sm">{d.evening}</p></div>
            </div>
            {d.tips && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{d.tips}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

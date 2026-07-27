import { createFileRoute, Link } from "@tanstack/react-router";
import { Map, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const picks = [
  { name: "Bali", country: "Indonesia", why: "Warm year-round, rich culture, great value.", hue: "from-emerald-400 to-teal-500" },
  { name: "Porto", country: "Portugal", why: "Coastal charm, wine, mild climate.", hue: "from-orange-400 to-rose-500" },
  { name: "Kyoto", country: "Japan", why: "Temples, seasonal beauty, safe & walkable.", hue: "from-rose-400 to-amber-400" },
  { name: "Cape Town", country: "South Africa", why: "Mountains meet ocean, incredible food.", hue: "from-sky-400 to-indigo-500" },
  { name: "Reykjavík", country: "Iceland", why: "Nature at its most dramatic.", hue: "from-indigo-400 to-violet-500" },
  { name: "Oaxaca", country: "Mexico", why: "Cuisine, crafts, colonial streets.", hue: "from-amber-400 to-red-500" },
];

export const Route = createFileRoute("/_authenticated/discover")({
  component: Discover,
  head: () => ({ meta: [
    { title: "Discover — VoyaAI" },
    { name: "description", content: "Handpicked destinations, ready to plan." },
    { property: "og:title", content: "Discover — VoyaAI" },
    { property: "og:description", content: "Where to go next." },
  ] }),
});

function Discover() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">Discover</h1>
        <p className="text-muted-foreground mt-2">Curated destinations. Tap the planner to build an itinerary.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {picks.map(p => (
          <div key={p.name} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className={`h-40 bg-gradient-to-br ${p.hue}`}/>
            <div className="p-6">
              <div className="text-xs uppercase tracking-widest text-accent font-semibold">{p.country}</div>
              <h3 className="mt-1 font-display text-2xl">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.why}</p>
              <Link to="/planner"><Button variant="outline" className="mt-4 w-full rounded-full"><Compass className="mr-2 size-4"/>Plan a trip</Button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

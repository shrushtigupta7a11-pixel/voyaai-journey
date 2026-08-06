import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destIceland from "@/assets/dest-iceland.jpg";
import destMarrakesh from "@/assets/dest-marrakesh.jpg";
import destQueenstown from "@/assets/dest-queenstown.jpg";
import destLisbon from "@/assets/dest-lisbon.jpg";
import pkgAmalfi from "@/assets/pkg-amalfi.jpg";
import pkgKyoto from "@/assets/pkg-kyoto.jpg";

const picks = [
  { name: "Kyoto", country: "Japan", why: "Temples, seasonal beauty, safe & walkable.", img: destKyoto, tag: "Culture", rating: 4.9, from: 103000 },
  { name: "Santorini", country: "Greece", why: "Whitewashed cliffs and impossible sunsets.", img: destSantorini, tag: "Islands", rating: 4.8, from: 87000 },
  { name: "Reykjavík", country: "Iceland", why: "Nature at its most dramatic.", img: destIceland, tag: "Adventure", rating: 4.7, from: 125000 },
  { name: "Marrakesh", country: "Morocco", why: "Souks, spice and colour everywhere.", img: destMarrakesh, tag: "Markets", rating: 4.6, from: 63000 },
  { name: "Queenstown", country: "New Zealand", why: "Mountains, lakes and pure adrenaline.", img: destQueenstown, tag: "Nature", rating: 4.8, from: 145000 },
  { name: "Lisbon", country: "Portugal", why: "Coastal charm, wine, mild climate.", img: destLisbon, tag: "Coastal", rating: 4.7, from: 56000 },
  { name: "Amalfi Coast", country: "Italy", why: "Cliffside villages and long lunches.", img: pkgAmalfi, tag: "Romance", rating: 4.9, from: 132000 },
  { name: "Osaka", country: "Japan", why: "Street food capital, neon nights.", img: pkgKyoto, tag: "Food", rating: 4.6, from: 98000 },
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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border p-8 text-white shadow-luxury md:p-12"
        style={{ background: "linear-gradient(120deg, oklch(0.42 0.14 260), oklch(0.55 0.15 235) 55%, oklch(0.7 0.18 32))" }}>
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-white/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <Compass className="size-3.5" /> Curated by VoyaAI
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">Discover your next escape</h1>
          <p className="mt-3 max-w-xl text-white/85">Handpicked destinations with real photography, ratings and starting prices. Tap any card to build an itinerary instantly.</p>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((p) => (
          <Link key={p.name} to="/planner"
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-luxury">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img src={p.img} alt={`${p.name}, ${p.country}`} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">{p.tag}</span>
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                <Star className="size-3 fill-current text-amber-300" />{p.rating}
              </span>
              <div className="absolute inset-x-3 bottom-3 text-white">
                <h3 className="font-display text-2xl leading-tight drop-shadow">{p.name}</h3>
                <p className="flex items-center gap-1 text-[11px] opacity-90"><MapPin className="size-3" />{p.country}</p>
                <p className="mt-2 max-h-0 overflow-hidden text-[11px] opacity-0 transition-all duration-300 group-hover:max-h-16 group-hover:opacity-90">{p.why}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="text-xs text-muted-foreground">from <span className="font-semibold text-foreground">₹{p.from.toLocaleString("en-IN")}</span></div>
              <Button size="sm" variant="outline" className="rounded-full">Plan</Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

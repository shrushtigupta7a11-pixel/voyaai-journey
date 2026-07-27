import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Map, MessageCircle, ShieldCheck, Wallet,
  Package, Globe2, Camera, Utensils, CloudSun, Languages, Leaf,
  Bell, Search, Star, Compass, Instagram, Twitter, Github,
} from "lucide-react";
import heroCoast from "@/assets/hero-coast.jpg";
import { PublicNav } from "@/components/layout/PublicNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "VoyaAI — Your AI travel concierge" },
      {
        name: "description",
        content:
          "Plan smarter trips with VoyaAI: AI itineraries, packing lists, budgets, safety insights, and a chatbot that knows every corner of the world.",
      },
      { property: "og:title", content: "VoyaAI — Your AI travel concierge" },
      {
        property: "og:description",
        content: "AI-powered smart tourism & travel management for the curious.",
      },
    ],
  }),
});

const destinations = [
  { name: "Kyoto", country: "Japan", tag: "Culture", hue: "from-rose-400 via-orange-300 to-amber-200" },
  { name: "Santorini", country: "Greece", tag: "Islands", hue: "from-sky-400 via-cyan-300 to-blue-200" },
  { name: "Reykjavík", country: "Iceland", tag: "Adventure", hue: "from-indigo-400 via-violet-300 to-fuchsia-200" },
  { name: "Marrakesh", country: "Morocco", tag: "Markets", hue: "from-amber-500 via-orange-400 to-red-300" },
  { name: "Queenstown", country: "New Zealand", tag: "Nature", hue: "from-emerald-500 via-teal-400 to-cyan-300" },
  { name: "Lisbon", country: "Portugal", tag: "Coastal", hue: "from-yellow-300 via-orange-300 to-pink-300" },
];

const packages = [
  { title: "The Amalfi Slow-Burn", days: "7 days", price: 2400, hue: "from-orange-300 to-rose-400" },
  { title: "Kyoto Zen Circuit", days: "10 days", price: 3100, hue: "from-emerald-300 to-teal-500" },
  { title: "Iceland Ring Road", days: "8 days", price: 3600, hue: "from-sky-300 to-indigo-500" },
];

const features = [
  { icon: Map, title: "AI Trip Planner", desc: "Day-by-day itineraries tuned to your pace, budget and interests." },
  { icon: MessageCircle, title: "Travel Chatbot", desc: "Ask anything — visas, food, hidden neighborhoods, safety." },
  { icon: Package, title: "Smart Packing", desc: "Dynamic checklists calibrated to climate & activities." },
  { icon: Wallet, title: "Budget Estimator", desc: "Flights, stay, food, activities — visualized with clarity." },
  { icon: ShieldCheck, title: "Safety Advisor", desc: "Local advisories, emergency contacts, one-tap SOS." },
  { icon: Camera, title: "Landmark Vision", desc: "Point your camera; get history, tickets and stories." },
  { icon: Utensils, title: "Food Concierge", desc: "Cuisine matched to your diet, budget and mood." },
  { icon: CloudSun, title: "Weather Intelligence", desc: "7-day forecast, rain alerts and packing hints." },
  { icon: Languages, title: "Live Translator", desc: "Voice & text translation in 60+ languages." },
  { icon: Globe2, title: "Currency Converter", desc: "Live rates, expense tracking in your home currency." },
  { icon: Leaf, title: "Carbon Footprint", desc: "See your trip's emissions and greener alternatives." },
  { icon: Bell, title: "Smart Reminders", desc: "Flights, visas, passports — nothing slips." },
];

const testimonials = [
  { name: "Elena Petrov", role: "Photographer", text: "VoyaAI turned three cities and eleven flights into one calm plan. It felt like having a local friend everywhere." },
  { name: "Marcus Chen", role: "Founder", text: "Booked, packed and briefed in an afternoon. The chatbot even flagged a public strike two days before we landed." },
  { name: "Aisha Rahman", role: "Solo traveler", text: "The safety layer alone is worth it. Real advisories, not paranoia." },
];

const faqs = [
  { q: "Does VoyaAI actually book flights and hotels?", a: "You can plan, budget and organize everything here, then book via your preferred partners. Booking integrations are being added by region." },
  { q: "How is the AI personalized?", a: "It learns from your interests, past trips, and travel style. You can edit any suggestion and it adapts." },
  { q: "Can I use it offline?", a: "Downloaded itineraries, packing lists, maps and translations work without a signal." },
  { q: "Is my data private?", a: "Your trips and chats live in your account, protected by row-level security. Deleteable any time." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroCoast}
            alt="Golden hour aerial view of coastal cliffs"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-foreground/80">
              <Sparkles className="size-3.5 text-accent" /> Powered by Lovable AI
            </span>
            <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
              Travel with <span className="italic text-gradient">intelligence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              VoyaAI plans, packs, budgets and guides — so every trip feels
              curated by a friend who knows the place, and the season.
            </p>
          </div>

          {/* Smart search */}
          <div className="mt-10 glass shadow-luxury rounded-3xl p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-4xl">
            <div className="flex-1 rounded-2xl px-5 py-3">
              <label className="block text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">Where to?</label>
              <input placeholder="Try 'quiet beaches in Sicily'" className="mt-1 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60" />
            </div>
            <div className="hidden md:block w-px bg-border/60 my-2" />
            <div className="flex-1 rounded-2xl px-5 py-3">
              <label className="block text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">Dates</label>
              <input placeholder="Anytime" className="mt-1 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60" />
            </div>
            <div className="hidden md:block w-px bg-border/60 my-2" />
            <div className="flex-1 rounded-2xl px-5 py-3">
              <label className="block text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">Travelers</label>
              <input placeholder="2 adults" className="mt-1 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60" />
            </div>
            <Link to="/auth" className="md:w-auto">
              <Button size="lg" className="w-full rounded-2xl px-8 h-full">
                <Search className="mr-2 size-4" /> Plan with AI
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["4.9/5", "Traveler rating"],
              ["140+", "Countries"],
              ["2.4M", "Trips planned"],
              ["24/7", "AI concierge"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-4xl">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Trending</span>
              <h2 className="mt-2 font-display text-5xl">Curated escapes</h2>
            </div>
            <a href="#features" className="hidden text-sm font-medium text-primary md:inline-flex">View all →</a>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {destinations.map((d) => (
              <div key={d.name} className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${d.hue} transition-transform duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block rounded-full bg-white/20 backdrop-blur px-2.5 py-0.5 text-[10px] uppercase tracking-wider">{d.tag}</span>
                  <h3 className="mt-3 font-display text-3xl leading-tight">{d.name}</h3>
                  <p className="text-sm opacity-80">{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl md:text-5xl">Popular packages</h2>
          <p className="mt-2 text-muted-foreground">Hand-picked routes, pre-tuned by the AI.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {packages.map((p) => (
              <div key={p.title} className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${p.hue}`} />
                <div className="p-6">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{p.days}</span>
                    <span className="text-foreground font-semibold">from ${p.price}</span>
                  </div>
                  <Link to="/auth"><Button variant="outline" className="mt-4 w-full rounded-full">Explore</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section id="features" className="px-6 py-24 bg-surface">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">The intelligence layer</span>
            <h2 className="mt-2 font-display text-5xl md:text-6xl">Every travel superpower, in one place.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Fifteen AI capabilities — from planning to safety — woven into a
              single, calm interface.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-luxury">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-5xl">Loved by curious travelers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.text}"</p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24 bg-surface">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-5xl">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] gradient-hero p-12 text-center text-primary-foreground shadow-luxury">
          <h2 className="font-display text-5xl md:text-6xl leading-tight">Your next journey<br />plans itself.</h2>
          <p className="mt-4 opacity-90">Free to start. No credit card. Just curiosity.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="mt-8 rounded-full px-8">
              Start planning <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl">
              <Compass className="size-5 text-primary" />
              Voya<span className="text-primary">AI</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Intelligent travel, effortlessly planned.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Github].map((I, i) => (
                <a key={i} href="#" className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase font-semibold tracking-widest text-muted-foreground mb-4">Product</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-primary">AI Features</a></li>
              <li><a href="#destinations" className="hover:text-primary">Destinations</a></li>
              <li><Link to="/auth" className="hover:text-primary">Get started</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase font-semibold tracking-widest text-muted-foreground mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary">Story</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase font-semibold tracking-widest text-muted-foreground mb-4">Newsletter</h5>
            <p className="text-sm text-muted-foreground mb-3">Hidden gems, weekly.</p>
            <div className="flex gap-2">
              <Input placeholder="you@travel.com" className="rounded-full" />
              <Button className="rounded-full">Join</Button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} VoyaAI. All rights reserved.</span>
          <div className="flex gap-6"><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}

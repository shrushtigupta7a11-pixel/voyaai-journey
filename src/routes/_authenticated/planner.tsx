import { createFileRoute, useNavigate, useServerFn } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Loader2, Save } from "lucide-react";
import { generateTripPlan } from "@/lib/ai.functions";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/planner")({
  component: Planner,
  head: () => ({ meta: [
    { title: "AI Trip Planner — VoyaAI" },
    { name: "description", content: "Generate a personalized day-by-day itinerary in seconds." },
    { property: "og:title", content: "AI Trip Planner — VoyaAI" },
    { property: "og:description", content: "AI-crafted travel itineraries with budgets and tips." },
  ] }),
});

const COLORS = ["#0EA5E9", "#FF6B4A", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

function Planner() {
  const plan = useServerFn(generateTripPlan);
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState("USD");
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState("balanced");
  const [interests, setInterests] = useState("food, museums, hiking");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateTripPlan>>["plan"] | null>(null);

  async function run(save: boolean) {
    if (!destination) return toast.error("Where to?");
    setBusy(true);
    try {
      const res = await plan({ data: {
        destination, days, budget, currency, travelers,
        travelStyle: style,
        interests: interests.split(",").map(s => s.trim()).filter(Boolean),
        saveTrip: save,
      }});
      setResult(res.plan);
      if (res.tripId) {
        toast.success("Trip saved!");
        navigate({ to: "/trips/$tripId", params: { tripId: res.tripId } });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Planning failed");
    } finally { setBusy(false); }
  }

  const chartData = result?.budget_breakdown
    ? Object.entries(result.budget_breakdown).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">AI Trip Planner</h1>
        <p className="mt-2 text-muted-foreground">Describe your dream trip. The AI does the rest.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={(e) => { e.preventDefault(); run(false); }} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit">
          <div><Label>Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Kyoto, Japan"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Days</Label><Input type="number" min={1} max={21} value={days} onChange={(e) => setDays(+e.target.value)}/></div>
            <div><Label>Travelers</Label><Input type="number" min={1} value={travelers} onChange={(e) => setTravelers(+e.target.value)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Budget</Label><Input type="number" min={0} value={budget} onChange={(e) => setBudget(+e.target.value)}/></div>
            <div><Label>Currency</Label><Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())}/></div>
          </div>
          <div><Label>Travel style</Label><Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="luxury / backpacker / balanced"/></div>
          <div><Label>Interests</Label><Textarea rows={2} value={interests} onChange={(e) => setInterests(e.target.value)}/></div>
          <div className="flex gap-2">
            <Button className="flex-1 rounded-full" disabled={busy}>{busy ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Sparkles className="mr-2 size-4"/>}Generate</Button>
            {result && <Button type="button" variant="outline" className="rounded-full" disabled={busy} onClick={() => run(true)}><Save className="mr-2 size-4"/>Save trip</Button>}
          </div>
        </form>

        <div className="space-y-6">
          {!result && !busy && (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <Sparkles className="mx-auto size-8 opacity-40"/>
              <p className="mt-3">Fill in the form and generate your itinerary.</p>
            </div>
          )}
          {busy && !result && (
            <div className="rounded-3xl border border-border bg-card p-12 text-center animate-pulse">
              <Loader2 className="mx-auto size-8 animate-spin text-primary"/>
              <p className="mt-3 text-muted-foreground">Curating your itinerary…</p>
            </div>
          )}
          {result && (
            <>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h2 className="font-display text-3xl">{result.title}</h2>
                <p className="mt-2 text-muted-foreground">{result.summary}</p>
                {result.top_attractions?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.top_attractions.map((a) => (
                      <span key={a} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">{a}</span>
                    ))}
                  </div>
                )}
              </div>

              {chartData.length > 0 && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-xl mb-2">Budget breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${v} ${currency}`}/>
                        <Legend/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {result.days.map(d => (
                  <div key={d.day} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl">Day {d.day} — {d.title}</h3>
                      {d.estimated_cost != null && <span className="text-sm text-muted-foreground">≈ {d.estimated_cost} {currency}</span>}
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Morning</div><p className="mt-1 text-sm">{d.morning}</p></div>
                      <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Afternoon</div><p className="mt-1 text-sm">{d.afternoon}</p></div>
                      <div><div className="text-xs uppercase tracking-widest text-accent font-semibold">Evening</div><p className="mt-1 text-sm">{d.evening}</p></div>
                    </div>
                    {d.food && <div className="mt-3 text-sm"><span className="font-semibold">Eat:</span> {d.food}</div>}
                    {d.tips && <div className="mt-2 text-sm text-muted-foreground">💡 {d.tips}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

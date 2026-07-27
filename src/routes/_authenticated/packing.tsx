import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { generatePackingList } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Item = { category: string; name: string; checked: boolean };
type List = { id: string; title: string; items: Item[] };

export const Route = createFileRoute("/_authenticated/packing")({
  component: Packing,
  head: () => ({ meta: [
    { title: "Smart Packing — VoyaAI" },
    { name: "description", content: "AI-generated packing checklists tailored to your destination, weather, and activities." },
    { property: "og:title", content: "Smart Packing — VoyaAI" },
    { property: "og:description", content: "Never forget an essential." },
  ] }),
});

function Packing() {
  const gen = (generatePackingList);
  const [dest, setDest] = useState(""); const [days, setDays] = useState(5);
  const [season, setSeason] = useState("summer"); const [type, setType] = useState("leisure");
  const [busy, setBusy] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  async function refresh() {
    const { data } = await supabase.from("packing_lists").select("id,title,items").order("created_at", { ascending: false });
    setLists((data ?? []) as any);
  }
  useEffect(() => { refresh(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!dest) return;
    setBusy(true);
    try {
      await gen({ data: { destination: dest, days, season, tripType: type } });
      toast.success("Packing list created");
      await refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }

  async function toggle(list: List, idx: number) {
    const items = [...list.items];
    items[idx] = { ...items[idx], checked: !items[idx].checked };
    await supabase.from("packing_lists").update({ items }).eq("id", list.id);
    setLists(ls => ls.map(l => l.id === list.id ? { ...l, items } : l));
  }
  async function del(id: string) {
    await supabase.from("packing_lists").delete().eq("id", id);
    await refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">Smart packing</h1>
        <p className="text-muted-foreground mt-2">AI-generated checklists you can tick off as you go.</p>
      </div>
      <form onSubmit={create} className="rounded-3xl border border-border bg-card p-6 shadow-soft grid gap-4 md:grid-cols-5 items-end">
        <div className="md:col-span-2"><Label>Destination</Label><Input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Iceland"/></div>
        <div><Label>Days</Label><Input type="number" min={1} value={days} onChange={(e) => setDays(+e.target.value)}/></div>
        <div><Label>Season</Label><Input value={season} onChange={(e) => setSeason(e.target.value)}/></div>
        <Button className="rounded-full" disabled={busy}>{busy ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Sparkles className="mr-2 size-4"/>}Generate</Button>
      </form>
      {lists.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Package className="mx-auto size-8 opacity-40"/><p className="mt-2">No packing lists yet.</p>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {lists.map(l => {
          const grouped = l.items.reduce<Record<string, { item: Item; idx: number }[]>>((acc, it, i) => {
            (acc[it.category] ||= []).push({ item: it, idx: i }); return acc;
          }, {});
          const done = l.items.filter(i => i.checked).length;
          return (
            <div key={l.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl">{l.title}</h3>
                  <p className="text-xs text-muted-foreground">{done}/{l.items.length} packed</p>
                </div>
                <button onClick={() => del(l.id)} className="text-sm text-muted-foreground hover:text-destructive">Delete</button>
              </div>
              <div className="mt-4 space-y-4">
                {Object.entries(grouped).map(([cat, entries]) => (
                  <div key={cat}>
                    <div className="text-xs uppercase font-semibold tracking-widest text-accent">{cat}</div>
                    <ul className="mt-2 space-y-1">
                      {entries.map(({ item, idx }) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={item.checked} onCheckedChange={() => toggle(l, idx)} />
                          <span className={item.checked ? "line-through text-muted-foreground" : ""}>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

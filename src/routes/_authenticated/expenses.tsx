import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Wallet } from "lucide-react";

const CATS = ["Flights", "Stay", "Food", "Transport", "Activities", "Shopping", "Misc"];
type Exp = { id: string; category: string; amount: number; currency: string; note: string | null; spent_on: string };

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
  head: () => ({ meta: [
    { title: "Expenses — VoyaAI" },
    { name: "description", content: "Track your travel spending with categories and analytics." },
    { property: "og:title", content: "Expenses — VoyaAI" },
    { property: "og:description", content: "Where your money goes on the road." },
  ] }),
});

function Expenses() {
  const [items, setItems] = useState<Exp[]>([]);
  const [category, setCategory] = useState("Food"); const [amount, setAmount] = useState(0); const [note, setNote] = useState("");
  async function refresh() {
    const { data } = await supabase.from("expenses").select("*").order("spent_on", { ascending: false });
    setItems((data ?? []) as Exp[]);
  }
  useEffect(() => { refresh(); }, []);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("expenses").insert({ user_id: u.user.id, category, amount, note });
    setAmount(0); setNote(""); await refresh();
  }
  const chart = CATS.map(c => ({ name: c, value: items.filter(i => i.category === c).reduce((s, i) => s + Number(i.amount), 0) }));
  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">Expenses</h1>
        <p className="text-muted-foreground mt-2">Track your spending across trips.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={add} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit">
          <div><Label>Category</Label>
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><Label>Amount (USD)</Label><Input type="number" min={0} value={amount} onChange={(e) => setAmount(+e.target.value)}/></div>
          <div><Label>Note</Label><Input value={note} onChange={(e) => setNote(e.target.value)}/></div>
          <Button className="w-full rounded-full">Add expense</Button>
        </form>
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2"><Wallet className="size-5 text-primary"/><h2 className="font-display text-2xl">Total: ${total.toFixed(2)}</h2></div>
            <div className="h-64 mt-4">
              <ResponsiveContainer>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis dataKey="name" fontSize={12}/><YAxis fontSize={12}/><Tooltip/>
                  <Bar dataKey="value" fill="#0EA5E9" radius={[8, 8, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-xl mb-2">Recent</h3>
            <ul className="divide-y divide-border">
              {items.slice(0, 15).map(i => (
                <li key={i.id} className="py-2 flex items-center justify-between">
                  <div><div className="font-medium">{i.category}</div><div className="text-xs text-muted-foreground">{i.note || i.spent_on}</div></div>
                  <div className="font-semibold">${Number(i.amount).toFixed(2)}</div>
                </li>
              ))}
              {items.length === 0 && <li className="text-sm text-muted-foreground py-6 text-center">No expenses yet.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

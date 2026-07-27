import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";

// Static demo rates (approx). Real rates would use a live API.
const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155.5, INR: 83.2, AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24, SGD: 1.34, THB: 36.4, MXN: 17.1,
};

export const Route = createFileRoute("/_authenticated/currency")({
  component: Currency,
  head: () => ({ meta: [
    { title: "Currency Converter — VoyaAI" },
    { name: "description", content: "Convert between major world currencies." },
    { property: "og:title", content: "Currency Converter — VoyaAI" },
    { property: "og:description", content: "Fast, clean currency conversion." },
  ] }),
});

function Currency() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const result = (amount / RATES[from]) * RATES[to];
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">Currency converter</h1>
        <p className="text-muted-foreground mt-2">Quick conversion using stored reference rates.</p>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div><Label>Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)}/></div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div><Label>From</Label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => { setFrom(to); setTo(from); }} className="grid size-10 place-items-center rounded-full border border-border text-primary">
            <ArrowRightLeft className="size-4"/>
          </button>
          <div><Label>To</Label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="rounded-2xl gradient-hero p-6 text-primary-foreground">
          <p className="text-sm opacity-80">{amount} {from} =</p>
          <p className="font-display text-4xl">{result.toFixed(2)} {to}</p>
        </div>
      </div>
    </div>
  );
}

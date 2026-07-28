import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, TrendingUp, Globe2, Sparkles } from "lucide-react";

// Static demo rates relative to USD (approx).
const RATES: Record<string, { rate: number; name: string; flag: string }> = {
  INR: { rate: 83.2, name: "Indian Rupee", flag: "🇮🇳" },
  USD: { rate: 1, name: "US Dollar", flag: "🇺🇸" },
  EUR: { rate: 0.92, name: "Euro", flag: "🇪🇺" },
  GBP: { rate: 0.79, name: "British Pound", flag: "🇬🇧" },
  JPY: { rate: 155.5, name: "Japanese Yen", flag: "🇯🇵" },
  AUD: { rate: 1.52, name: "Australian Dollar", flag: "🇦🇺" },
  CAD: { rate: 1.36, name: "Canadian Dollar", flag: "🇨🇦" },
  CHF: { rate: 0.88, name: "Swiss Franc", flag: "🇨🇭" },
  CNY: { rate: 7.24, name: "Chinese Yuan", flag: "🇨🇳" },
  SGD: { rate: 1.34, name: "Singapore Dollar", flag: "🇸🇬" },
  THB: { rate: 36.4, name: "Thai Baht", flag: "🇹🇭" },
  AED: { rate: 3.67, name: "UAE Dirham", flag: "🇦🇪" },
  MXN: { rate: 17.1, name: "Mexican Peso", flag: "🇲🇽" },
};

const POPULAR = ["USD", "EUR", "GBP", "JPY", "AED", "THB"];

export const Route = createFileRoute("/_authenticated/currency")({
  component: Currency,
  head: () => ({
    meta: [
      { title: "Currency Converter — VoyaAI" },
      { name: "description", content: "Convert Indian Rupees to major world currencies with a clean, colorful travel-ready tool." },
      { property: "og:title", content: "Currency Converter — VoyaAI" },
      { property: "og:description", content: "Fast, colorful currency conversion for travelers." },
    ],
  }),
});

function convert(amount: number, from: string, to: string) {
  return (amount / RATES[from].rate) * RATES[to].rate;
}

function Currency() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");

  const result = useMemo(() => convert(amount, from, to), [amount, from, to]);
  const single = useMemo(() => convert(1, from, to), [from, to]);

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-border shadow-luxury">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.15 235) 0%, oklch(0.62 0.16 200) 45%, oklch(0.72 0.17 55) 100%)",
          }}
        />
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-3 p-8 text-white md:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Travel money, made simple
          </span>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">Currency converter</h1>
          <p className="max-w-xl text-white/85">
            Plan your spend abroad. Convert Indian Rupees into any of the currencies you'll actually use on the road.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Converter card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="amount" className="text-xs uppercase tracking-wide text-muted-foreground">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(+e.target.value || 0)}
                className="mt-1 h-14 text-2xl font-display"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <CurrencySelect label="From" value={from} onChange={setFrom} />
              <button
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                aria-label="Swap currencies"
                className="grid size-12 shrink-0 place-items-center rounded-full text-white shadow-soft transition hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.15 235), oklch(0.7 0.18 32))",
                }}
              >
                <ArrowRightLeft className="size-5" />
              </button>
              <CurrencySelect label="To" value={to} onChange={setTo} />
            </div>

            {/* Result */}
            <div
              className="rounded-2xl p-6 text-white shadow-luxury"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.15 235) 0%, oklch(0.7 0.18 32) 100%)",
              }}
            >
              <p className="text-sm opacity-85">
                {RATES[from].flag} {amount.toLocaleString()} {from} equals
              </p>
              <p className="mt-1 font-display text-4xl md:text-5xl">
                {RATES[to].flag} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm opacity-85">
                <TrendingUp className="size-4" />
                1 {from} = {single.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
              </p>
            </div>
          </div>
        </div>

        {/* Popular INR conversions */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-2">
            <Globe2 className="size-5 text-primary" />
            <h2 className="font-display text-2xl">Popular from INR</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Live-feel reference rates for common travel currencies.</p>
          <ul className="mt-5 space-y-2">
            {POPULAR.map((code, i) => {
              const val = convert(1000, "INR", code);
              const tints = [
                "oklch(0.95 0.05 235)",
                "oklch(0.94 0.06 32)",
                "oklch(0.94 0.06 160)",
                "oklch(0.95 0.06 80)",
                "oklch(0.94 0.06 300)",
                "oklch(0.94 0.06 200)",
              ];
              return (
                <li
                  key={code}
                  className="flex items-center justify-between rounded-2xl border border-border/60 p-4 transition hover:shadow-soft"
                  style={{ background: tints[i % tints.length] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{RATES[code].flag}</span>
                    <div>
                      <p className="font-semibold text-foreground">{code}</p>
                      <p className="text-xs text-muted-foreground">{RATES[code].name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-foreground">
                      {val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">per ₹1,000</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CurrencySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="min-w-0">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2">
        <span className="text-xl">{RATES[value].flag}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none"
        >
          {Object.keys(RATES).map((c) => (
            <option key={c} value={c}>
              {c} — {RATES[c].name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

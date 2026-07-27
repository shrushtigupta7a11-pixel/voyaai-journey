// Server-only helpers for calling the Lovable AI Gateway.
// Do NOT import from client code — this file is *.server.ts.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.5-flash";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

function apiKey(): string {
  const k = process.env.LOVABLE_API_KEY;
  if (!k) throw new Error("Missing LOVABLE_API_KEY");
  return k;
}

async function callGateway(body: Record<string, unknown>): Promise<string> {
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey(),
    },
    body: JSON.stringify({ model: MODEL, ...body }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

export async function chatText(messages: ChatMsg[]): Promise<string> {
  return callGateway({ messages });
}

export async function chatJSON<T>(messages: ChatMsg[]): Promise<T> {
  const raw = await callGateway({
    messages,
    response_format: { type: "json_object" },
  });
  // Some models still wrap JSON in a code fence — strip defensively.
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract JSON substring
    const m = cleaned.match(/\{[\s\S]*\}$/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("AI returned invalid JSON.");
  }
}

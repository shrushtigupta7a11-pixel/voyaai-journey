import { createFileRoute, useParams, useServerFn } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sendChatMessage } from "@/lib/ai.functions";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThread,
});

type Msg = { id: string; role: "user" | "assistant" | "system"; content: string };

function ChatThread() {
  const { threadId } = useParams({ from: "/_authenticated/chat/$threadId" });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const send = useServerFn(sendChatMessage);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.from("chat_messages").select("id,role,content").eq("thread_id", threadId).order("created_at").then(({ data }) => {
      setMessages((data ?? []) as Msg[]);
    });
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const optimistic: Msg = { id: `tmp-${Date.now()}`, role: "user", content: text };
    setMessages(m => [...m, optimistic]);
    setBusy(true);
    try {
      const { reply } = await send({ data: { threadId, message: text }});
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: "assistant", content: reply }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.length === 0 && !busy && (
          <p className="text-center text-muted-foreground">Say hello 👋 or ask about any destination.</p>
        )}
        {messages.map(m => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 shadow-soft">{m.content}</div>
            ) : (
              <div className="max-w-[80%] prose prose-sm dark:prose-invert text-foreground">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {busy && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin"/>Thinking…</div>}
        <div ref={endRef}/>
      </div>
      <form onSubmit={submit} className="border-t border-border p-4 flex gap-2 items-end">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask anything about travel…"
          rows={2}
          disabled={busy}
          className="resize-none"
        />
        <Button type="submit" size="icon" className="rounded-full h-11 w-11 shrink-0" disabled={busy || !input.trim()}>
          <Send className="size-4"/>
        </Button>
      </form>
    </div>
  );
}

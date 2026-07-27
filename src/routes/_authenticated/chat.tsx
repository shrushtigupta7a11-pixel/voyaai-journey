import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createChatThread } from "@/lib/ai.functions";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatLayout,
  head: () => ({ meta: [
    { title: "AI Concierge — VoyaAI" },
    { name: "description", content: "Chat with your AI travel concierge — visas, food, safety, packing, and more." },
    { property: "og:title", content: "AI Concierge — VoyaAI" },
    { property: "og:description", content: "Your always-on travel assistant." },
  ] }),
});

function ChatLayout() {
  const [threads, setThreads] = useState<{ id: string; title: string }[]>([]);
  const params = useParams({ strict: false }) as { threadId?: string };
  const navigate = useNavigate();
  const newThread = (createChatThread);

  async function refresh() {
    const { data } = await supabase.from("chat_threads").select("id,title").order("updated_at", { ascending: false });
    setThreads(data ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function create() {
    const { id } = await newThread();
    await refresh();
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  async function del(id: string) {
    await supabase.from("chat_threads").delete().eq("id", id);
    await refresh();
    if (params.threadId === id) navigate({ to: "/chat" });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]">
      <aside className="rounded-3xl border border-border bg-card p-4 shadow-soft flex flex-col">
        <Button onClick={create} className="rounded-full"><Plus className="mr-2 size-4"/>New chat</Button>
        <div className="mt-4 flex-1 overflow-auto space-y-1">
          {threads.length === 0 && <p className="text-sm text-muted-foreground p-3">No conversations yet.</p>}
          {threads.map(t => {
            const active = params.threadId === t.id;
            return (
              <div key={t.id} className={`group flex items-center justify-between rounded-xl px-2 py-2 text-sm ${active ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                <Link to="/chat/$threadId" params={{ threadId: t.id }} className="flex-1 truncate">{t.title}</Link>
                <button onClick={() => del(t.id)} className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive px-2">×</button>
              </div>
            );
          })}
        </div>
      </aside>
      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden flex flex-col">
        {params.threadId ? <Outlet /> : (
          <div className="flex-1 grid place-items-center text-center p-8">
            <div>
              <MessageCircle className="mx-auto size-10 text-primary"/>
              <h2 className="mt-4 font-display text-3xl">Your AI concierge</h2>
              <p className="mt-2 text-muted-foreground max-w-md">Ask about visas, hidden neighborhoods, food, packing, safety — anything.</p>
              <Button onClick={create} className="mt-6 rounded-full"><Plus className="mr-2 size-4"/>Start a conversation</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

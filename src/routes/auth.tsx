import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — VoyaAI" },
      { name: "description", content: "Sign in to VoyaAI to plan intelligent trips, chat with our AI concierge and manage your travel." },
      { property: "og:title", content: "Sign in — VoyaAI" },
      { property: "og:description", content: "Access your AI travel concierge." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: redirect || "/dashboard", replace: true });
    });
  }, [navigate, redirect]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: redirect || "/dashboard", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account.");
  }

  async function signInGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setBusy(false); return toast.error(result.error.message || "Google sign-in failed"); }
    if (result.redirected) return;
    setBusy(false);
    navigate({ to: redirect || "/dashboard", replace: true });
  }

  async function forgotPw(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent.");
    setForgot(false);
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative gradient-hero">
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl w-fit">
            <Compass className="size-5" /> VoyaAI
          </Link>
          <div>
            <h1 className="font-display text-5xl leading-tight">
              Your journey,<br />intelligently curated.
            </h1>
            <p className="mt-4 opacity-90 max-w-sm">
              Sign in to plan trips, chat with our AI concierge, track budgets and travel with confidence.
            </p>
          </div>
          <div className="text-xs opacity-70">© {new Date().getFullYear()} VoyaAI</div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 md:px-14">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:hidden">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="w-full max-w-sm mx-auto">
          {forgot ? (
            <>
              <h2 className="font-display text-4xl">Reset password</h2>
              <p className="mt-2 text-sm text-muted-foreground">We'll email you a link to set a new one.</p>
              <form onSubmit={forgotPw} className="mt-8 space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button className="w-full rounded-full" disabled={busy}>Send reset link</Button>
                <button type="button" onClick={() => setForgot(false)} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">Back to sign in</button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-4xl">Welcome</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {tab === "signin" ? "Sign in to your VoyaAI account." : "Create your account — it's free."}
              </p>

              <Button variant="outline" className="mt-8 w-full rounded-full" onClick={signInGoogle} disabled={busy}>
                <svg className="mr-2 size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z"/><path fill="currentColor" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.4v2.8C4.1 20.5 7.8 23 12 23z"/><path fill="currentColor" d="M6 14.2c-.2-.7-.3-1.4-.3-2.2s.1-1.5.3-2.2V7H2.4C1.5 8.6 1 10.2 1 12s.5 3.4 1.4 5l3.6-2.8z"/><path fill="currentColor" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2 14.9 1 12 1 7.8 1 4.1 3.5 2.4 7L6 9.8c.9-2.5 3.2-4.4 6-4.4z"/></svg>
                Continue with Google
              </Button>

              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={signIn} className="space-y-4">
                    <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div>
                      <div className="flex justify-between items-baseline"><Label htmlFor="password">Password</Label>
                        <button type="button" onClick={() => setForgot(true)} className="text-xs text-primary hover:underline">Forgot?</button>
                      </div>
                      <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button className="w-full rounded-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={signUp} className="space-y-4">
                    <div><Label htmlFor="name">Name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div><Label htmlFor="email2">Email</Label><Input id="email2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div><Label htmlFor="password2">Password</Label><Input id="password2" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <Button className="w-full rounded-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

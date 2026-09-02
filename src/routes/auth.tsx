import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site/SiteHeader";
import mark from "@/assets/aurelia-mark.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Aurelia Advisory" },
      {
        name: "description",
        content:
          "Sign in to Aurelia to keep every Thai property consultation saved to your account across devices.",
      },
      { property: "og:title", content: "Sign in · Aurelia Advisory" },
      {
        property: "og:description",
        content: "Access your saved Bangkok real estate consultations with Aurelia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const target = redirect && redirect.startsWith("/") ? redirect : "/chat";

  useEffect(() => {
    if (!loading && session) navigate({ to: target, replace: true });
  }, [loading, session, navigate, target]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${target}` },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: target, replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <img src={mark} alt="Aurelia monogram" width={64} height={64} className="size-16" />
        <p className="eyebrow mt-6 text-primary">The Aurelia Console</p>
        <h1 className="mt-3 text-center font-display text-3xl">
          {mode === "signin" ? "Enter the advisory room" : "Open an advisory file"}
        </h1>
        <p className="mt-3 text-center text-sm text-foreground/60">
          Your consultations are saved to your account, so a conversation survives every page you
          visit.
        </p>

        <form onSubmit={submit} className="mt-8 w-full space-y-4">
          <label className="block">
            <span className="eyebrow text-foreground/50">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/30 focus:border-primary"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="eyebrow text-foreground/50">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/30 focus:border-primary"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-6 flex w-full items-center gap-4 text-foreground/40">
          <span className="h-px flex-1 bg-border" />
          <span className="eyebrow">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={google}
          disabled={busy}
          className="w-full border border-primary/50 px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-8 text-xs uppercase tracking-[0.2em] text-foreground/50 transition-colors hover:text-primary"
        >
          {mode === "signin" ? "No account yet? Register" : "Already registered? Sign in"}
        </button>
      </main>
    </div>
  );
}

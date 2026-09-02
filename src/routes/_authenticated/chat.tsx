import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  createConversation,
  deleteConversation,
  listConversations,
} from "@/lib/conversations";
import mark from "@/assets/aurelia-mark.png";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "The Aurelia Console · Thai Property Advisory Chat" },
      {
        name: "description",
        content:
          "Consult Aurelia on Bangkok condominium quotas, rental yields, transfer taxes and lawful ownership structures for foreign investors.",
      },
      { property: "og:title", content: "The Aurelia Console" },
      {
        property: "og:description",
        content: "Regulation-first AI advisory chat for foreign investors in Thai real estate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatLayout,
});

const functions = [
  { label: "Market Snapshot", prompt: "Give me a current snapshot of the Bangkok condo market for a foreign buyer." },
  { label: "Yield Estimator", prompt: "Help me estimate the net rental yield on a Bangkok condo. Ask me for the numbers you need." },
  { label: "Compliance Check", prompt: "Walk me through the legal checks before I sign on a Bangkok condominium as a foreigner." },
];

function ChatLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeId = useRouterState({
    select: (state) => (state.matches.find((m) => m.routeId === "/_authenticated/chat/$conversationId")?.params as { conversationId?: string } | undefined)?.conversationId,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });

  const startConversation = async (prompt?: string) => {
    if (!user) return;
    try {
      const conversation = await createConversation(user.id);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: conversation.id },
        search: prompt ? { prompt } : {},
      });
    } catch {
      toast.error("Could not start a new consultation.");
    }
  };

  const removeConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (id === activeId) navigate({ to: "/chat" });
    } catch {
      toast.error("Could not delete that consultation.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* SIDEBAR */}
          <aside className="border border-border bg-surface lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 border-b border-border px-5 py-4">
              <img src={mark} alt="Aurelia monogram" width={28} height={28} className="size-7" />
              <span className="eyebrow text-primary">Aurelia</span>
            </Link>

            <div className="border-b border-primary/10 px-5 py-4">
              <button
                onClick={() => startConversation()}
                className="w-full bg-primary px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-gold-light"
              >
                New consultation
              </button>
            </div>

            <div className="border-b border-primary/10 px-5 py-3">
              <p className="eyebrow mb-2 text-foreground/40">History</p>
              <ul className="space-y-1 text-sm">
                {conversations.length === 0 && (
                  <li className="px-2 py-1.5 text-foreground/40">No saved consultations yet.</li>
                )}
                {conversations.map((conversation) => {
                  const isActive = conversation.id === activeId;
                  return (
                    <li
                      key={conversation.id}
                      className={`group flex items-center gap-2 border-l-2 pr-1 ${
                        isActive
                          ? "border-primary bg-primary/15 text-gold-light"
                          : "border-transparent text-foreground/70 hover:bg-surface-raised"
                      }`}
                    >
                      <Link
                        to="/chat/$conversationId"
                        params={{ conversationId: conversation.id }}
                        className="flex-1 truncate px-2 py-1.5"
                      >
                        {conversation.title}
                      </Link>
                      <button
                        aria-label="Delete consultation"
                        onClick={() => removeConversation(conversation.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="size-3.5 text-foreground/50 hover:text-destructive" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-b border-primary/10 px-5 py-3">
              <p className="eyebrow mb-2 text-foreground/40">Functions</p>
              <ul className="space-y-1 text-sm text-foreground/70">
                {functions.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => startConversation(item.prompt)}
                      className="w-full px-2 py-1.5 text-left hover:bg-surface-raised"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-5 py-3">
              <p className="eyebrow mb-2 text-foreground/40">Settings</p>
              <ul className="space-y-1 text-sm text-foreground/70">
                <li className="truncate px-2 py-1.5">{user?.email}</li>
                <li className="px-2 py-1.5">Language · EN</li>
                <li>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate({ to: "/" });
                    }}
                    className="w-full px-2 py-1.5 text-left hover:bg-surface-raised"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* CHAT */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

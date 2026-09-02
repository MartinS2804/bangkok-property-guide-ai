import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { loadMessages } from "@/lib/conversations";

export const Route = createFileRoute("/_authenticated/chat/$conversationId")({
  validateSearch: (search: Record<string, unknown>) => ({
    prompt: typeof search["prompt"] === "string" ? (search["prompt"] as string) : "",
  }),
  component: ConversationPage,
});

function ConversationPage() {
  const { conversationId } = useParams({ from: "/_authenticated/chat/$conversationId" });
  const { prompt } = useSearch({ from: "/_authenticated/chat/$conversationId" });

  const { data, isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => loadMessages(conversationId),
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center border border-border bg-surface">
        <p className="eyebrow text-primary/70">Retrieving the file…</p>
      </div>
    );
  }

  return (
    <ChatWindow
      key={conversationId}
      conversationId={conversationId}
      initialMessages={data}
      initialPrompt={prompt || ""}
    />
  );
}

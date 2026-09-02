import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useAuth } from "@/hooks/useAuth";
import { createConversation } from "@/lib/conversations";
import mark from "@/assets/aurelia-mark.png";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatStart,
});

function ChatStart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const begin = async (prompt: string) => {
    if (!user) return;
    try {
      const conversation = await createConversation(user.id);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: conversation.id },
        search: { prompt },
      });
    } catch {
      toast.error("Could not start a new consultation.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center border border-border bg-surface px-6">
      <img src={mark} alt="Aurelia monogram" width={64} height={64} className="size-16" />
      <p className="eyebrow mt-6 text-primary">The Aurelia Console</p>
      <h1 className="mt-3 text-center font-display text-3xl">
        Advice for foreign investors in Thai property
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-foreground/60">
        Integrity and regulation come first. Ask a question to open a consultation — every thread is
        saved to your account.
      </p>

      <div className="mt-8 w-full max-w-2xl">
        <PromptInput
          onSubmit={(message) => {
            const text = message.text?.trim();
            if (text) void begin(text);
          }}
        >
          <PromptInputTextarea placeholder="e.g. Is a Phrom Phong condo still inside the foreign quota?" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

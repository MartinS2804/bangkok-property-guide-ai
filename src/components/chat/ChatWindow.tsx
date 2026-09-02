import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { supabase } from "@/integrations/supabase/client";
import mark from "@/assets/aurelia-mark.png";

type Props = {
  conversationId: string;
  initialMessages: UIMessage[];
  initialPrompt?: string;
};

export function ChatWindow({ conversationId, initialMessages, initialPrompt }: Props) {
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sentInitial = useRef(false);

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
      headers: async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Aurelia could not respond. Please try again.");
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversationId]);

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  useEffect(() => {
    if (sentInitial.current) return;
    if (!initialPrompt || initialMessages.length > 0) return;
    sentInitial.current = true;
    void sendMessage({ text: initialPrompt });
  }, [initialPrompt, initialMessages.length, sendMessage]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col border border-border bg-surface">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-8">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md py-16 text-center">
              <img
                src={mark}
                alt="Aurelia monogram"
                width={56}
                height={56}
                className="mx-auto size-14"
              />
              <h2 className="mt-6 font-display text-2xl">How may I advise you?</h2>
              <p className="mt-3 text-sm text-foreground/60">
                Ask about the 49% condominium quota, lawful land structures, transfer taxes, the FET
                form, or realistic net yields by district.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <Message key={message.id} from={message.role} className="mb-6">
              <MessageContent
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent p-0 text-foreground"
                }
              >
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <MessageResponse key={index}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && <Shimmer>Consulting the regulations…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-4">
        <PromptInput
          onSubmit={(message) => {
            const text = message.text?.trim();
            if (!text || busy) return;
            void sendMessage({ text });
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Ask Aurelia about investing in Bangkok property…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={busy} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-3 text-center text-[11px] text-foreground/40">
          Aurelia offers educational guidance only — confirm all matters with a licensed Thai
          solicitor before committing funds.
        </p>
      </div>
    </div>
  );
}

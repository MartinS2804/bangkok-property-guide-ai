import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { AURELIA_SYSTEM_PROMPT } from "@/lib/aurelia-prompt.server";
import { createUserSupabaseClient } from "@/lib/supabase-user.server";

type ChatRequestBody = { messages?: unknown; conversationId?: unknown };

function textOf(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const conversationId = body.conversationId;
        if (!Array.isArray(messages) || typeof conversationId !== "string") {
          return new Response("messages and conversationId are required", { status: 400 });
        }

        const supabase = createUserSupabaseClient(token);
        const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
        const userId = claimsData?.claims?.sub;
        if (claimsError || !userId) return new Response("Unauthorized", { status: 401 });

        const { data: conversation, error: conversationError } = await supabase
          .from("conversations")
          .select("id, title")
          .eq("id", conversationId)
          .maybeSingle();
        if (conversationError) return new Response("Could not load conversation", { status: 500 });
        if (!conversation) return new Response("Conversation not found", { status: 404 });

        const uiMessages = messages as UIMessage[];
        const lastMessage = uiMessages[uiMessages.length - 1];

        if (lastMessage?.role === "user") {
          const { error: insertError } = await supabase.from("messages").insert({
            conversation_id: conversation.id,
            user_id: userId,
            role: "user",
            parts: lastMessage.parts as never,
            client_message_id: lastMessage.id ?? null,
          });
          if (insertError) console.error("[chat] failed to save user message", insertError);

          const firstLine = textOf(lastMessage).slice(0, 60);
          if (conversation.title === "New consultation" && firstLine) {
            await supabase
              .from("conversations")
              .update({ title: firstLine })
              .eq("id", conversation.id);
          } else {
            await supabase
              .from("conversations")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", conversation.id);
          }
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });

        const gateway = createLovableAiGatewayProvider(apiKey);

        const result = streamText({
          model: gateway("google/gemini-3.7-flash"),
          system: AURELIA_SYSTEM_PROMPT,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ responseMessage }) => {
            if (!responseMessage) return;
            const { error } = await supabase.from("messages").insert({
              conversation_id: conversation.id,
              user_id: userId,
              role: "assistant",
              parts: responseMessage.parts as never,
              client_message_id: responseMessage.id ?? null,
            });
            if (error) console.error("[chat] failed to save assistant message", error);
          },
        });
      },
    },
  },
});

"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";

import { ChatResponseData } from "@/core/entities/chat.entity";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/presentation/components/features/chat/chat-bubble";
import { ChatInput } from "@/presentation/components/features/chat/chat-input";
import { ChatMessageList } from "@/presentation/components/features/chat/chat-message-list";
import {
    ExpandableChat,
    ExpandableChatBody,
    ExpandableChatFooter,
    ExpandableChatHeader,
} from "@/presentation/components/features/chat/expandable-chat";
import { Button } from "@/presentation/components/ui/button";
import {
    useChatHistoryQuery,
    useSendChatMessageMutation,
} from "@/presentation/hooks/features/chat/use-chat-api";

type Message =
    | { id: number; sender: "user"; content: string }
    | { id: number; sender: "ai"; content: ChatResponseData };
export function ChatAI() {
    const [input, setInput] = useState("");
    const idRef = useRef(1);
    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError,
    } = useChatHistoryQuery();
    const {
        mutate: sendMessage,
        isPending: isSending,
        error: sendError,
    } = useSendChatMessageMutation();

    // Construction des messages à partir de l'historique
    const messages: Message[] = [];

    if (historyData && Array.isArray(historyData.history)) {
        let id = 1;

        for (const entry of historyData.history) {
            if (typeof entry === "string" && entry.startsWith("Q:")) {
                messages.push({
                    id: id++,
                    sender: "user",
                    content: entry.replace(/^Q:\s*/, ""),
                });
            } else if (typeof entry === "string" && entry.startsWith("A:")) {
                try {
                    const aiContent = JSON.parse(entry.replace(/^A:\s*/, ""));

                    messages.push({
                        id: id++,
                        sender: "ai",
                        content: aiContent,
                    });
                } catch {
                    messages.push({
                        id: id++,
                        sender: "ai",
                        content: {
                            assistant_message: entry,
                            found_data: [],
                            clarification_question: null,
                        },
                    });
                }
            }
        }
        idRef.current = id;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input, {
            onSuccess: () => setInput(""),
        });
    };

    const error = historyError?.message || sendError?.message || null;
    const isLoading = isHistoryLoading || isSending;

    return (
        <div className="pointer-events-none fixed bottom-0 right-0 z-[1200] h-[600px]">
            <ExpandableChat
                className="pointer-events-auto"
                icon={<Bot className="size-6" />}
                position="bottom-right"
                size="md"
            >
                <ExpandableChatHeader className="flex-col justify-center text-center">
                    <h1 className="text-xl font-semibold">Chat IA ✨</h1>
                    <p className="text-sm text-muted-foreground">
                        Posez-moi vos questions sur la plateforme
                    </p>
                </ExpandableChatHeader>

                <ExpandableChatBody>
                    <ChatMessageList>
                        {messages.map((message) => (
                            <ChatBubble
                                key={message.id}
                                variant={
                                    message.sender === "user"
                                        ? "sent"
                                        : "received"
                                }
                            >
                                <ChatBubbleAvatar
                                    className="size-8 shrink-0"
                                    fallback={
                                        message.sender === "user" ? "US" : "AI"
                                    }
                                    src={
                                        message.sender === "user"
                                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                                            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    }
                                />
                                <ChatBubbleMessage
                                    variant={
                                        message.sender === "user"
                                            ? "sent"
                                            : "received"
                                    }
                                >
                                    {message.sender === "user" ? (
                                        message.content
                                    ) : (
                                        <div>
                                            <div>
                                                {
                                                    message.content
                                                        .assistant_message
                                                }
                                            </div>
                                            {message.content.found_data.length >
                                                0 && (
                                                <ul className="mt-2 list-disc pl-4 text-xs">
                                                    {message.content.found_data.map(
                                                        (fd, i) => (
                                                            <li key={i}>
                                                                <div className="font-semibold">
                                                                    {
                                                                        fd.establishment_name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        fd.establishment_acronym
                                                                    }
                                                                    )
                                                                </div>
                                                                <div>
                                                                    {fd.address}{" "}
                                                                    — {fd.type}{" "}
                                                                    —{" "}
                                                                    {fd.sector}
                                                                </div>
                                                                <ul className="list-square ml-2">
                                                                    {fd.formations.map(
                                                                        (
                                                                            f,
                                                                            j
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    j
                                                                                }
                                                                            >
                                                                                {
                                                                                    f.title
                                                                                }{" "}
                                                                                (
                                                                                {
                                                                                    f.level
                                                                                }

                                                                                )
                                                                                -{" "}
                                                                                {
                                                                                    f.domain_mention
                                                                                }{" "}
                                                                                {f.duration_months
                                                                                    ? `- ${f.duration_months} mois`
                                                                                    : ""}{" "}
                                                                                [
                                                                                {
                                                                                    f.authorization_status
                                                                                }

                                                                                ]
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                            {message.content
                                                .clarification_question && (
                                                <div className="mt-2 text-xs italic text-muted-foreground">
                                                    {
                                                        message.content
                                                            .clarification_question
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        ))}

                        {isLoading && (
                            <ChatBubble variant="received">
                                <ChatBubbleAvatar
                                    className="size-8 shrink-0"
                                    fallback="AI"
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                />
                                <ChatBubbleMessage isLoading />
                            </ChatBubble>
                        )}
                        {error && (
                            <div className="p-2 text-xs text-red-500">
                                {error}
                            </div>
                        )}
                    </ChatMessageList>
                </ExpandableChatBody>

                <ExpandableChatFooter>
                    <form
                        className="relative flex items-end gap-2 rounded-lg border bg-background p-1 focus-within:ring-1 focus-within:ring-ring"
                        onSubmit={handleSubmit}
                    >
                        <ChatInput
                            className="min-h-12 flex-1 resize-none rounded-lg border-0 bg-background p-3 shadow-none focus-visible:ring-0"
                            disabled={isLoading}
                            placeholder="Écrivez votre message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            aria-label="Envoyer"
                            className="gap-1.5"
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            type="submit"
                        >
                            <Send className="size-5" />
                        </Button>
                    </form>
                </ExpandableChatFooter>
            </ExpandableChat>
        </div>
    );
}

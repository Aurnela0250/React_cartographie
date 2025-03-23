"use client";

import { Bot, Info, Loader2, Send, User } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/presentation/components/ui/avatar";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour ! Je suis l'assistant virtuel d'OrientaMada. Comment puis-je vous aider dans votre orientation ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        formation:
          "Il existe de nombreuses formations dans l'enseignement supérieur : BTS, BUT, Licence, Master, École d'ingénieur, etc. Quelle filière vous intéresse particulièrement ?",
        inscription:
          "Les inscriptions sur OrientaMada ouvrent généralement en janvier. Vous pourrez alors formuler vos vœux jusqu'en mars.",
        bourse:
          "Pour les bourses, vous devez constituer un Dossier Social Étudiant (DSE) sur le site du CROUS. La demande doit être faite entre janvier et mai.",
        logement:
          "De nombreux établissements proposent des résidences universitaires. Vous pouvez également consulter les offres du CROUS ou les plateformes de logement étudiant.",
      };

      let botResponse =
        "Je ne suis pas sûr de comprendre votre question. Pouvez-vous préciser ce que vous recherchez concernant l'orientation ou les établissements d'enseignement supérieur ?";

      // Simple keyword matching
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userMessage.content.toLowerCase().includes(keyword)) {
          botResponse = response;
          break;
        }
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="h-[calc(100vh-120px)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </Avatar>
            <div>
              <CardTitle>Assistant Parcours Sup</CardTitle>
              <CardDescription>
                Posez vos questions sur l'orientation et les formations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-280px)] border-b border-t">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-2 ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar
                        className={`h-8 w-8 ${message.sender === "user" ? "bg-secondary" : "bg-primary"}`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] gap-2">
                      <Avatar className="h-8 w-8 bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </Avatar>
                      <div className="flex items-center rounded-lg bg-muted p-3">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <p>L'assistant réfléchit...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>
                L'assistant utilise l'IA pour répondre à vos questions sur
                l'orientation
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Posez votre question ici..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

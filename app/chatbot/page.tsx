"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Info, Loader2 } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotPage() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour ! Je suis l'assistant virtuel d'OrientaMada. Comment puis-je vous aider dans votre orientation ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

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
      }

      let botResponse =
        "Je ne suis pas sûr de comprendre votre question. Pouvez-vous préciser ce que vous recherchez concernant l'orientation ou les établissements d'enseignement supérieur ?"

      // Simple keyword matching
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userMessage.content.toLowerCase().includes(keyword)) {
          botResponse = response
          break
        }
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-120px)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </Avatar>
            <div>
              <CardTitle>Assistant Parcours Sup</CardTitle>
              <CardDescription>Posez vos questions sur l'orientation et les formations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-b h-[calc(100vh-280px)]">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className={`h-8 w-8 ${message.sender === "user" ? "bg-secondary" : "bg-primary"}`}>
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
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
                    <div className="flex gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>L'assistant utilise l'IA pour répondre à vos questions sur l'orientation</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Posez votre question ici..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


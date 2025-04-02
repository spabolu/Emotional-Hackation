"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, RefreshCw } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Predefined responses for the AI therapist
const AI_RESPONSES = [
  "How does that make you feel?",
  "That's interesting. Can you tell me more about that?",
  "I understand this might be difficult. Take your time.",
  "It sounds like you're going through a lot right now.",
  "Have you tried looking at this situation from a different perspective?",
  "What do you think would help you feel better in this moment?",
  "Remember to be kind to yourself during challenging times.",
  "It's okay to feel this way. Your emotions are valid.",
  "Let's explore some coping strategies that might help with this.",
  "What small step could you take today to improve your situation?",
  "I'm here to listen whenever you need to talk.",
  "That sounds challenging. How have you been managing so far?",
  "What support do you have in your life right now?",
  "Have you noticed any patterns in when these feelings arise?",
  "What has helped you get through similar situations in the past?",
]

export default function AiTherapist() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your AI companion. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
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
    setIsTyping(true)

    // Simulate AI thinking and responding
    setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const resetConversation = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hi there! I'm your AI companion. How are you feeling today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="border-teal-200 bg-white/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-teal-200">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Therapist" />
            <AvatarFallback className="bg-teal-500 text-white">AI</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>AI Companion</CardTitle>
            <CardDescription>Chat with your supportive AI friend anytime.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto rounded-md border border-teal-100 bg-white p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="mt-1 text-right text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-gray-100 p-3 text-gray-800">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-teal-600 hover:bg-teal-700" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="w-full" onClick={resetConversation}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Conversation
        </Button>
      </CardFooter>
    </Card>
  )
}


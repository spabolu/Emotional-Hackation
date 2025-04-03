"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export default function TherapistAvatar({ entryContent, mood }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Generate initial response based on journal content and mood
  useEffect(() => {
    const initialResponses = {
      Happy: [
        "I notice you're feeling happy today! What's the highlight that brought you the most joy?",
        "It's wonderful to see you in good spirits! Would you like to explore what contributed to this positive mood?",
      ],
      Sad: [
        "I see you're feeling down today. Would you like to talk more about what's weighing on your mind?",
        "I'm here to listen if you want to share more about what's making you feel sad.",
      ],
      Anxious: [
        "I notice some anxiety in your entry. What small step could you take today to help manage those feelings?",
        "Anxiety can be challenging. Is there a specific part of your entry you'd like to explore further?",
      ],
      Tired: [
        "It sounds like you're feeling tired. How might you prioritize rest in the coming days?",
        "Being tired can affect us in many ways. What self-care practices help you when you're feeling this way?",
      ],
      Grateful: [
        "Your gratitude shines through in this entry! What other things, big or small, are you appreciating lately?",
        "I love seeing your grateful perspective. How does practicing gratitude impact other areas of your life?",
      ],
      Neutral: [
        "How are you feeling about what you've written today?",
        "Is there anything specific from your entry you'd like to discuss further?",
      ],
    }

    // Default to neutral if mood not found
    const moodResponses = initialResponses[mood] || initialResponses["Neutral"]

    // Pick a random response from the mood-specific options
    const randomResponse = moodResponses[Math.floor(Math.random() * moodResponses.length)]

    // Set typing indicator
    setIsTyping(true)

    // Set initial message after a short delay to simulate thinking
    const timer = setTimeout(() => {
      setIsTyping(false)
      setMessages([
        {
          text: randomResponse,
          sender: "therapist",
        },
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [entryContent, mood])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: input,
        sender: "user",
      },
    ])

    setInput("")

    // Simulate therapist typing
    setIsTyping(true)

    // Simulate therapist response
    const therapistResponses = [
      "That's an interesting perspective. How does that make you feel?",
      "Thank you for sharing that. What do you think this reveals about your priorities?",
      "I appreciate your openness. How might you approach this differently next time?",
      "That's insightful. Do you notice any patterns in how you respond to similar situations?",
      "I hear you. What would be a small step you could take that might help?",
      "That makes sense. How does this connect to your values and what matters most to you?",
      "I'm curious - what would your future self advise you about this situation?",
      "Thank you for sharing. What strengths are you drawing on to navigate this?",
    ]

    const randomResponse = therapistResponses[Math.floor(Math.random() * therapistResponses.length)]

    // Add therapist response after a delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          text: randomResponse,
          sender: "therapist",
        },
      ])
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="rounded-lg border border-fuchsia-200 bg-white/80 overflow-hidden">
      <div className="p-4 border-b border-fuchsia-200 flex items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-fuchsia-100 flex items-center justify-center text-2xl">🦉</div>
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        <div>
          <h4 className="font-medium text-fuchsia-900">Serene Owl</h4>
          <p className="text-xs text-emerald-700">Your mindfulness companion</p>
        </div>
      </div>

      <div className="p-4 h-[250px] overflow-y-auto space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {message.sender === "therapist" && (
                <div className="flex items-end gap-2">
                  <div className="h-8 w-8 rounded-full bg-fuchsia-100 flex items-center justify-center text-lg">
                    🦉
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-none max-w-[80%] bg-fuchsia-100 text-fuchsia-900">
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              )}

              {message.sender === "user" && (
                <div className="p-3 rounded-2xl rounded-br-none max-w-[80%] bg-emerald-100 text-emerald-900">
                  <p className="text-sm">{message.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div className="flex items-end gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="h-8 w-8 rounded-full bg-fuchsia-100 flex items-center justify-center text-lg">🦉</div>
            <div className="p-3 rounded-2xl rounded-bl-none bg-fuchsia-100">
              <div className="flex gap-1">
                <motion.div
                  className="h-2 w-2 rounded-full bg-fuchsia-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-fuchsia-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-fuchsia-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-fuchsia-200 flex gap-2">
        <Input
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white/60 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
        />
        <Button onClick={handleSendMessage} className="bg-fuchsia-600 hover:bg-fuchsia-700">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


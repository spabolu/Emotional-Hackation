"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RefreshCw } from "lucide-react"

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
  const [input, setInput] = useState("")
  const [aiMessage, setAiMessage] = useState(
    "Hi there! I'm your squirrel companion. Let's reflect together!"
  )
  const [isTyping, setIsTyping] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [threadId, setThreadId] = useState("thread_1ZtkgumkEA1re5OIdxfw0TRc") // hardcoded to test user

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput("")
    setIsGenerating(true)
    setShowGif(true)

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {  // Updated URL to point to Flask backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Thread-ID': threadId || '',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store thread ID for conversation continuity
        if (data.thread_id) {
          setThreadId(data.thread_id);
        }
        
        // Add slight delay for natural interaction
        setTimeout(() => {
          setAiMessage(data.response);
          setIsGenerating(false);
          
          // Switch back to still image after response is shown
          setTimeout(() => {
            setShowGif(false);
            setIsTyping(false); // Allow user to type again
          }, 1000);
        }, 1000);
      } else {
        console.error('Error from server:', data.error);
        setAiMessage("Sorry, I encountered an error. Please try again.");
        setIsGenerating(false);
        setShowGif(false);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      setAiMessage("Sorry, I couldn't connect to the server. Please check your connection.");
      setIsGenerating(false);
      setShowGif(false);
      setIsTyping(false);
    }
  }

  const resetConversation = () => {
    setAiMessage("Hi there! I'm your squirrel companion. Let's reflect together!")
    setIsTyping(false)
    setIsGenerating(false)
    setShowGif(false)
    setThreadId("") // Clear thread ID for new conversation
  }

  return (
    <Card className="border-teal-200 bg-white/80 text-center mt-6">
      <CardHeader>
        <CardTitle>Squirrel Companion</CardTitle>
        <CardDescription>Your reflective journal buddy 🐿️</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center p-6 min-h-[400px]">
        <div className="relative">
          <img
            src={
              showGif
                ? "/squirrel_therapist.gif" // Show GIF while generating response
                : "/squirrel_smile.png" // Show still image otherwise
            }
            alt="Squirrel Companion"
            className="w-80 h-80 object-contain transition-all duration-300"
          />
          <div className="absolute top-[100px] left-[240px] bg-white shadow-md rounded-xl p-3 border border-teal-300 max-w-[250px]">
            {isGenerating ? (
              <div className="flex space-x-1 justify-center">
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
            ) : (
              <p className="text-sm">{aiMessage}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-teal-600 hover:bg-teal-700"
          >
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

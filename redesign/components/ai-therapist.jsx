"use client";

import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function AiTherapist({
  threadId = "",
  setThreadId,
  journalEntry = "",
}) {
  const [input, setInput] = useState("");
  const [aiMessage, setAiMessage] = useState(
    "Hi there! I'm your squirrel companion. Let's reflect together!"
  );
  const [displayedMessage, setDisplayedMessage] = useState(""); // word-by-word animated text
  const [fullMessageQueue, setFullMessageQueue] = useState(""); // holds the full message to animate
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [internalThreadId, setInternalThreadId] = useState(threadId);
  const lastProcessedEntry = useRef("");
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const [isWaitingBeforeTyping, setIsWaitingBeforeTyping] = useState(false);

  // Update internal thread ID when prop changes
  useEffect(() => {
    setInternalThreadId(threadId);
  }, [threadId]);

  useEffect(() => {
    if (
      journalEntry &&
      !isGenerating &&
      journalEntry !== lastProcessedEntry.current
    ) {
      lastProcessedEntry.current = journalEntry;
      setDisplayedMessage("");
setIsGenerating(true);
setIsWaitingBeforeTyping(true);
setShowGif(false); // calm squirrel for typing dots


      const fetchReflection = async () => {
        try {
          const headers = { "Content-Type": "application/json" };
          if (internalThreadId) {
            headers["X-Thread-ID"] = internalThreadId;
          }

          const response = await fetch("http://127.0.0.1:5000/journal-entry", {
            method: "POST",
            headers,
            body: JSON.stringify({ entry: journalEntry }),
          });

          const data = await response.json();
          if (response.ok) {
            if (data.thread_id) {
              setInternalThreadId(data.thread_id);
              if (setThreadId) setThreadId(data.thread_id);
            }
            let finalResponse = data.response;
            if (isFirstResponse) {
              finalResponse =
                finalResponse.trim() + " Do you want to talk about it?";
              setIsFirstResponse(false);
            }
            setFullMessageQueue(finalResponse); // trigger word-by-word animation
            setDisplayedMessage("");
          } else {
            console.error("Error from server:", data.error);
            setFullMessageQueue(
              "Sorry, I encountered an error. Please try again."
            );
          }
        } catch (error) {
          console.error("Network error:", error);
          setFullMessageQueue(
            "Sorry, I couldn't connect to the server. Please check your connection."
          );
        }
      };

      fetchReflection();
    }
  }, [journalEntry]);

  useEffect(() => {
    if (!fullMessageQueue) return;

    const words = fullMessageQueue.trim().split(" ");
    let currentIndex = 0;

    // Start with a "thinking" pause
    setIsWaitingBeforeTyping(true);
    setIsGenerating(true);
    setShowGif(false); // still calm

    const typingDelay = setTimeout(() => {
      setIsWaitingBeforeTyping(false);
      setShowGif(true); // now talking

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          const word = words[currentIndex];
          if (word !== undefined) {
            setDisplayedMessage((prev) =>
              prev ? `${prev} ${word}` : word
            );
          }
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
          setShowGif(false);
        }
      }, 60);
    }, 600); // Delay before word-by-word typing starts

    return () => {
      clearTimeout(typingDelay);
    };
  }, [fullMessageQueue]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
  
    // ⛔️ Immediately clear old message
    setDisplayedMessage("");
    setIsWaitingBeforeTyping(true);
    setIsGenerating(true);
    setShowGif(false); // calm squirrel
  
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (internalThreadId) {
        headers["X-Thread-ID"] = internalThreadId;
      }
  
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: userMessage }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.thread_id) {
          setInternalThreadId(data.thread_id);
          if (setThreadId) setThreadId(data.thread_id);
        }
  
        // 🟢 Just set the full message — useEffect will handle typing
        setFullMessageQueue(data.response + " ");
      } else {
        console.error("Error from server:", data.error);
        setFullMessageQueue("Sorry, I encountered an error. Please try again.");
        setIsWaitingBeforeTyping(false);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setFullMessageQueue(
        "Sorry, I couldn't connect to the server. Please check your connection."
      );
      setIsWaitingBeforeTyping(false);
      setIsGenerating(false);
    }
  };
  

  const resetConversation = () => {
    const greeting =
      "Hi there! I'm your squirrel companion. Let's reflect together!";
    setAiMessage(greeting);
    setFullMessageQueue(greeting);
    setDisplayedMessage("");
    setIsGenerating(false);
    setShowGif(false);
    setInternalThreadId("");
    if (setThreadId) setThreadId("");
  };

  return (
    <Card className="border-teal-200 bg-white/80 text-center mt-6">
      <CardHeader>
        <CardTitle>Squirrel Companion</CardTitle>
        <CardDescription>Your reflective journal buddy 🐿️</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-start justify-start p-6 min-h-[400px]">
        <div className="relative flex items-start gap-4">
          <img
            src={
              showGif
                ? "/squirrel_therapist_new.gif"
                : "/squirrel_smile_scale.png"
            }
            alt="Squirrel Companion"
            className="w-100 h-100 object-contain transition-all duration-300"
          />

          <div className="bg-white shadow-md rounded-2xl p-6 border border-teal-300 w-[360px] min-h-[180px] text-left text-[1rem] leading-relaxed mt-20 ml-0 mr-20">
            {isGenerating && !displayedMessage ? (
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
              <div className="text-sm markdown-content">
                {/[*#\[\]_`]/.test(displayedMessage) ? (
                  <ReactMarkdown>{displayedMessage}</ReactMarkdown>
                ) : (
                  <p>{displayedMessage}</p>
                )}
              </div>
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
            disabled={!input.trim() || isGenerating}
            className="bg-fuchsia-400 hover:bg-fuchsia-700"
          >
            <Send className="h-4 w-4  text-white" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

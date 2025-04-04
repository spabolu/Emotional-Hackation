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
import { Send, RefreshCw } from "lucide-react";

export default function AiTherapist({
  threadId = "",
  setThreadId,
  journalEntry = "",
}) {
  const [input, setInput] = useState("");
  const [aiMessage, setAiMessage] = useState(
    "Hi there! I'm your squirrel companion. Let's reflect together!"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [internalThreadId, setInternalThreadId] = useState(threadId);
  const lastProcessedEntry = useRef("");

  // Update internal thread ID when prop changes
  useEffect(() => {
    setInternalThreadId(threadId);
  }, [threadId]);

  const [isFirstResponse, setIsFirstResponse] = useState(true);

  useEffect(() => {
    if (
      journalEntry &&
      !isGenerating &&
      journalEntry !== lastProcessedEntry.current
    ) {
      lastProcessedEntry.current = journalEntry;
      setIsGenerating(true);
      setShowGif(true);

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
            // Append the sentence only for the first response
            if (isFirstResponse) {
              finalResponse =
                finalResponse.trim() + " Do you want to talk about it?";
              setIsFirstResponse(false);
            }
            setAiMessage(finalResponse);
          } else {
            console.error("Error from server:", data.error);
            setAiMessage("Sorry, I encountered an error. Please try again.");
          }
        } catch (error) {
          console.error("Network error:", error);
          setAiMessage(
            "Sorry, I couldn't connect to the server. Please check your connection."
          );
        }

        setIsGenerating(false);
        setShowGif(false);
      };

      fetchReflection();
    }
  }, [journalEntry]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setIsGenerating(true);
    setShowGif(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (internalThreadId) {
        headers["X-Thread-ID"] = internalThreadId;
      }

      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.thread_id) {
          setInternalThreadId(data.thread_id);
          if (setThreadId) setThreadId(data.thread_id);
        }

        setTimeout(() => {
          setAiMessage(data.response);
          setIsGenerating(false);

          setTimeout(() => {
            setShowGif(false);
          }, 1000);
        }, 1000);
      } else {
        console.error("Error from server:", data.error);
        setAiMessage("Sorry, I encountered an error. Please try again.");
        setIsGenerating(false);
        setShowGif(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setAiMessage(
        "Sorry, I couldn't connect to the server. Please check your connection."
      );
      setIsGenerating(false);
      setShowGif(false);
    }
  };

  const resetConversation = () => {
    setAiMessage(
      "Hi there! I'm your squirrel companion. Let's reflect together!"
    );
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
              <div className="text-sm markdown-content">
                {/[*#\[\]_`]/.test(aiMessage) ? (
                  <ReactMarkdown>{aiMessage}</ReactMarkdown>
                ) : (
                  <p>{aiMessage}</p>
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

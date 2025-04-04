"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot } from "lucide-react";
import BoringAvatar from "boring-avatars";

export function Chat({ user, onBack, onFirstMessage }) {
  const [messages, setMessages] =  useState([]);

  // Fetch icebreaker from the API
  useEffect(() => {
    const fetchIcebreaker = async () => {
      try {
        // Fetch all icebreaker
        const response = await fetch(
          `http://127.0.0.1:5000/ice_breaker/${15}`
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching icebreaker: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("icebreaker (raw):", data); // Debugging log

        setMessages([
          {
            id: Date.now(),
            sender: "ai",
            content: data.ice_breaker,
          },
        ]);

      } catch (err) {
        console.error("Error fetching icebreaker:", err); // Debugging log
        setError(err.message);
      }
    };

    fetchIcebreaker();
  }, []);


  const [newMessage, setNewMessage] = useState("");
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        sender: "user",
        content: newMessage,
      };
      setMessages([...messages, userMessage]);
      setNewMessage("");

      if (!hasUserSentMessage) {
        setHasUserSentMessage(true);
        onFirstMessage(userMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-md">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        {/* <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={user.photo} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar> */}

        <Avatar className="w-16 h-16">
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {user.name ? (
              <BoringAvatar size={40} name={user.name} variant="beam" />
            ) : (
              <AvatarFallback>
                {user.name ? user.name.charAt(0) : "?"}
              </AvatarFallback>
            )}
          </div>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="flex items-center justify-center bg-emerald-500 rounded-full p-1 mr-2">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-fuchsia-600 text-white rounded-br-none"
                  : message.sender === "ai"
                  ? "bg-emerald-100 text-gray-800 rounded-bl-none border-l-4 border-emerald-500"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center mb-1">
                  <span className="text-xs font-semibold text-emerald-700">
                    AI Icebreaker
                  </span>
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
        <p>
          Chat with {user.name} using AI-powered icebreakers to start the
          conversation
        </p>
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 mr-2"
        />
        <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/user-card";
import { MessagePreview } from "@/components/message-preview";
import { Chat } from "@/components/chat";

export default function DiscoverSection() {
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Suggested connections
  const [acceptedUsers, setAcceptedUsers] = useState([]); // Accepted connections
  const [messages, setMessages] = useState([]); // State for messages
  const [currentChat, setCurrentChat] = useState(null); // State for the current chat
  const [error, setError] = useState(null); // State for error handling
  const [refreshConnections, setRefreshConnections] = useState(false); // State to trigger refetch

  // Fetch connections from the API
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const userId = 2; // Replace with the actual user ID

        // Fetch all connections
        const response = await fetch(
          `http://127.0.0.1:5000/fetch_connections/${userId}`
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching connections: ${response.statusText}`
          );
        }
        const data = await response.json();

        // Split connections into suggested and accepted
        const suggested = data.connections.filter(
          (connection) => connection.state === "suggested"
        );
        const accepted = data.connections.filter(
          (connection) => connection.state === "accepted"
        );

        setSuggestedUsers(suggested);
        setAcceptedUsers(accepted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchConnections();
  }, [refreshConnections]);

  const handleConnect = async (selectedUser) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/accept_connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connection_id: selectedUser.id }),
      });
  
      if (!response.ok) {
        throw new Error(`Error notifying backend: ${response.statusText}`);
      }
  
      setCurrentChat(selectedUser);
      setRefreshConnections((prev) => !prev); // Toggle refreshConnections to trigger useEffect
    } catch (err) {
      console.error("Failed to notify backend:", err);
    }
  };  

  const handleFirstMessage = (messageContent) => {
    if (currentChat) {
      const newMessage = {
        id: Date.now(),
        name: currentChat.name,
        message: messageContent,
        photo: currentChat.photo,
      };
      setMessages([newMessage, ...messages]);
      setSuggestedUsers(
        suggestedUsers.filter((user) => user.id !== currentChat.id)
      );
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (currentChat) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Chat
          user={currentChat}
          onBack={() => setCurrentChat(null)}
          onFirstMessage={handleFirstMessage}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Suggested for you
      </h2>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minHeight: "280px" }}>
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((connection) => (
              <UserCard
                key={connection.id}
                name={connection.display_name}
                photo={"/default-group-photo.png"} // Use default group photo
                description={connection.matched_insight || "No description available"}
                onConnect={() =>
                  handleConnect({
                    id: connection.id,
                    name: connection.display_name,
                    photo: "/default-avatar.png",
                    description: connection.matched_insight,
                  })
                }
              />
            ))
          ) : (
            <div className="w-full flex items-center justify-center text-gray-500">
              No more suggestions available
            </div>
          )}
        </div>
      </div>

      {/* WILL NOT CLICK INTO HERE */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Messages
      </h3>
      <div className="space-y-4">
        {acceptedUsers.length > 0 ? (
          acceptedUsers.map((user) => (
            <MessagePreview
              key={user.id}
              name={user.display_name}
              message={user.last_message || "No messages yet"} // Ensure `last_message` is used correctly
              photo={user.photo || "/default-avatar.png"} // Use default avatar if photo is missing
              onClick={() =>
                handleConnect({
                  id: user.id,
                  name: user.display_name,
                  photo: user.photo || "/default-avatar.png",
                  description: user.matched_insight,
                })
              }
            />
          ))
        ) : (
          <div className="text-gray-500 py-4">No messages yet</div>
        )}
      </div>
    </div>
  );
}
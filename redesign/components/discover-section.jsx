"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserCard } from "@/components/user-card"
import { MessagePreview } from "@/components/message-preview"
import { Chat } from "@/components/chat"

const initialSuggestedUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    photo: "/placeholder.svg?height=64&width=64",
    description: "UX Designer & Coffee Enthusiast",
  },
  { id: 2, name: "Bob Smith", photo: "/placeholder.svg?height=64&width=64", description: "Software Engineer & Gamer" },
  {
    id: 3,
    name: "Carol Williams",
    photo: "/placeholder.svg?height=64&width=64",
    description: "Marketing Specialist & Traveler",
  },
  {
    id: 4,
    name: "David Brown",
    photo: "/placeholder.svg?height=64&width=64",
    description: "Data Scientist & Musician",
  },
  {
    id: 5,
    name: "Eva Garcia",
    photo: "/placeholder.svg?height=64&width=64",
    description: "Product Manager & Yoga Instructor",
  },
]

const initialMessages = [
  {
    id: 101,
    name: "Frank Lee",
    message: "Are we still on for lunch tomorrow?",
    photo: "/placeholder.svg?height=40&width=40",
  },
]

export default function DiscoverSection() {
  const [suggestedUsers, setSuggestedUsers] = useState(initialSuggestedUsers)
  const [messages, setMessages] = useState(initialMessages)
  const [currentChat, setCurrentChat] = useState(null)
  const [hiddenUsers, setHiddenUsers] = useState([])

  const handleConnect = (user) => {
    setCurrentChat(user)
  }

  const handleRemoveCard = (id) => {
    setHiddenUsers([...hiddenUsers, id])
  }

  const handleBackFromChat = () => {
    setCurrentChat(null)
  }

  const handleFirstMessage = (messageContent) => {
    if (currentChat) {
      // Add user to messages list
      const newMessage = {
        id: Date.now(),
        name: currentChat.name,
        message: messageContent,
        photo: currentChat.photo,
      }
      setMessages([newMessage, ...messages])

      // Remove user from suggested list
      setSuggestedUsers(suggestedUsers.filter((user) => user.id !== currentChat.id))
    }
  }

  // Filter out hidden users but keep the container size consistent
  const visibleUsers = suggestedUsers.filter((user) => !hiddenUsers.includes(user.id))

  if (currentChat) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Chat user={currentChat} onBack={handleBackFromChat} onFirstMessage={handleFirstMessage} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggested for you</h2>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minHeight: "280px" }}>
          {visibleUsers.length > 0 ? (
            visibleUsers.map((user) => (
              <UserCard
                key={user.id}
                name={user.name}
                photo={user.photo}
                description={user.description}
                onConnect={() => handleConnect(user)}
                onRemove={() => handleRemoveCard(user.id)}
              />
            ))
          ) : (
            <div className="w-full flex items-center justify-center text-gray-500">No more suggestions available</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <Input
            placeholder="Search for topics, tags, or users..."
            className="pl-10 bg-white/80 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Messages</h3>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessagePreview
              key={message.id}
              name={message.name}
              message={message.message}
              photo={message.photo}
              onClick={() => {
                // Find the corresponding user in suggestedUsers or create a new user object
                const user = suggestedUsers.find((u) => u.name === message.name) || {
                  id: message.id,
                  name: message.name,
                  photo: message.photo,
                  description: "Chat contact",
                }
                handleConnect(user)
              }}
            />
          ))
        ) : (
          <div className="text-gray-500 py-4">No messages yet</div>
        )}
      </div>
    </div>
  )
}


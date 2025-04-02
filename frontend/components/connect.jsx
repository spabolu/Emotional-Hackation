"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const suggestedUsers = [
  { id: 1, name: "Alice Johnson", about: "Loves AI & mental health advocacy" },
  { id: 2, name: "Michael Lee", about: "Software engineer and coffee addict" },
  { id: 3, name: "Samantha Smith", about: "Yoga enthusiast & startup founder" },
  { id: 4, name: "Daniel Kim", about: "Cybersecurity expert & gamer" },
  { id: 5, name: "Sarah Lee", about: "Passionate about sustainability & tech" },
  { id: 6, name: "James Miller", about: "AI researcher & chess enthusiast" },
];

const chats = [
  { id: 1, name: "Alice Johnson", message: "Hey, how’s it going?" },
  { id: 2, name: "Michael Lee", message: "Let’s catch up sometime!" },
  { id: 3, name: "Samantha Smith", message: "Loved the new yoga routine!" },
  { id: 4, name: "Daniel Kim", message: "We should play some video games soon!" },
  { id: 5, name: "Sarah Lee", message: "How about collaborating on a project?" },
  { id: 6, name: "James Miller", message: "What do you think of the new tech trends?" },
];

export default function Connect() {
  const [connections, setConnections] = useState(suggestedUsers);
  const profilePicPath = "/profile_pic.png"; 

  const removeSuggestion = (id) => {
    setConnections(connections.filter((user) => user.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Suggested Users */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Suggested for You</h2>
        <div className="flex space-x-4 overflow-x-auto p-2">
          {connections.map((user) => (
            <Card key={user.id} className="relative w-52 min-w-[200px] h-[230px] flex flex-col justify-between">
              <CardHeader className="relative">
                <X
                  className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-800"
                  size={20}
                  onClick={() => removeSuggestion(user.id)}
                />
                <img
                  src={profilePicPath}
                  alt={user.name}
                  className="w-14 h-14 object-cover mx-auto -mt-10 border-2 border-white rounded-full"
                />
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center gap-3 pb-4">
                <CardTitle className="text-sm font-semibold">{user.name}</CardTitle>
                <p className="text-xs text-gray-500">{user.about}</p>
                <Button className="px-3 py-1 text-sm bg-teal-500 hover:bg-teal-600 mt-auto">Connect</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3">Messages</h2>
        <ScrollArea className="max-h-60 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 border-b hover:bg-teal-100 hover:text-teal-600 cursor-pointer transition-all duration-300"
            >
              <img
                src={profilePicPath}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{chat.name}</p>
                <p className="text-xs text-gray-500">{chat.message}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

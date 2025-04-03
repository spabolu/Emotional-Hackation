"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MessagePreview({ name, message, photo, onClick }) {
  return (
    <div
      className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm hover:bg-fuchsia-50 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={photo} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500 truncate">{message}</p>
      </div>
    </div>
  )
}


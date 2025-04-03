"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BoringAvatar from "boring-avatars";

export function MessagePreview({ name, message, onClick }) {
  return (
    <div
      className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm hover:bg-fuchsia-50 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <Avatar className="w-16 h-16">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {name ? (
            <BoringAvatar size={44} name={name} variant="beam" />
          ) : (
            <AvatarFallback>{name ? name.charAt(0) : "?"}</AvatarFallback>
          )}
        </div>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500 truncate">{message}</p>
      </div>
    </div>
  );
}

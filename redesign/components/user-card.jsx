"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Bot, Check, XIcon } from "lucide-react";
import BoringAvatar from "boring-avatars";

export function UserCard({ name, description, onConnect, onRemove }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const handleConfirmRemove = (e) => {
    e.stopPropagation();
    onRemove();
    setShowConfirmation(false);
  };

  const handleCancelRemove = (e) => {
    e.stopPropagation();
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center min-w-[200px] h-[250px] relative transition-all duration-200 hover:shadow-lg hover:bg-fuchsia-50">
      {showConfirmation ? (
        <div className="absolute top-2 left-2 right-2 bg-white shadow-md rounded-md p-2 z-10 border border-gray-200">
          <p className="text-xs text-gray-700 mb-2">Remove this suggestion?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelRemove}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Cancel"
            >
              <XIcon size={14} className="text-gray-600" />
            </button>
            <button
              onClick={handleConfirmRemove}
              className="p-1 rounded-full hover:bg-red-100"
              aria-label="Confirm remove"
            >
              <Check size={14} className="text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleRemoveClick}
          className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Remove card"
        >
          <X size={16} />
        </button>
      )}
      <Avatar className="w-16 h-16 mb-2">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {name ? (
            <BoringAvatar size={64} name={name} variant="beam" />
          ) : (
            <AvatarFallback>{name ? name.charAt(0) : "?"}</AvatarFallback>
          )}
        </div>
      </Avatar>

      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3 text-center">{description}</p>
      <Button
        onClick={() => onConnect()}
        className="bg-fuchsia-600 hover:bg-fuchsia-700 mt-auto flex items-center gap-1"
      >
        <Bot size={16} />
        Connect with AI
      </Button>
    </div>
  );
}

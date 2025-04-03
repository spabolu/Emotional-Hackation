"use client";

import { useState } from "react";
import { X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function NewJournalEntry({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    // Create a new entry object
    const newEntry = {
      id: Date.now(),
      title: title || "Untitled Entry",
      content,
      excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      mood: "Neutral",
      tags: ["untagged"],
    };

    console.log("New journal entry:", newEntry);
    onClose();
  };

  const isFormValid = () => {
    return title.trim().length > 0 && content.trim().length > 0;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-b from-fuchsia-50 to-emerald-50 rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-fuchsia-200 bg-white/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-fuchsia-900">
            Create New Journal Entry
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-fuchsia-600 hover:text-fuchsia-700 cursor-pointer"
          >
            <X className="h-5 w-5  " />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-fuchsia-900"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/60 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="content"
                className="text-sm font-medium text-fuchsia-900"
              >
                Journal Entry
              </label>
              <Textarea
                id="content"
                placeholder="Write your thoughts, reflections, and feelings..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] resize-none bg-white/60 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
              />
            </div>

            <div className="text-xs text-emerald-700 flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-fuchsia-200 bg-white/50 flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/60 border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!isFormValid()}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-300"
          >
            Save Entry
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { X, CalendarIcon, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function NewJournalEntry({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState(1);

  const moods = [
    { name: "Happy", emoji: "😊" },
    { name: "Sad", emoji: "😔" },
    { name: "Neutral", emoji: "😐" },
    { name: "Excited", emoji: "😃" },
    { name: "Anxious", emoji: "😰" },
    { name: "Relaxed", emoji: "😌" },
    { name: "Tired", emoji: "😴" },
    { name: "Grateful", emoji: "🙏" },
  ];

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    // In a real app, this would save the entry to a database
    // For now, we'll just close the form

    // Create a new entry object
    const newEntry = {
      id: Date.now(), // Use timestamp as temporary ID
      title: title || "Untitled Entry",
      content,
      excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      mood: selectedMood || "Neutral",
      tags: tags.length > 0 ? tags : ["untagged"],
    };

    console.log("New journal entry:", newEntry);

    // Close the form
    onClose();
  };

  const isFormValid = () => {
    if (step === 1) {
      return title.trim().length > 0 && content.trim().length > 0;
    }
    return selectedMood !== null;
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
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
        className="bg-gradient-to-b from-lavender-50 to-mint-50 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-lavender-200 bg-white/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-lavender-900">
            {step === 1 ? "Create New Journal Entry" : "Add Details"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-mint-700 hover:text-lavender-700 hover:bg-lavender-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 flex items-center justify-center">
          <div className="flex items-center w-24">
            <div
              className={`h-2 w-full rounded-l-full ${
                step >= 1 ? "bg-lavender-600" : "bg-lavender-200"
              }`}
            ></div>
          </div>
          <div className="flex items-center w-24">
            <div
              className={`h-2 w-full rounded-r-full ${
                step >= 2 ? "bg-lavender-600" : "bg-lavender-200"
              }`}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-lavender-900"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/60 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium text-lavender-900"
                  >
                    Journal Entry
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Write your thoughts, reflections, and feelings..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none bg-white/60 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-400"
                  />
                </div>

                <div className="text-xs text-mint-700 flex items-center gap-1">
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
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-sm font-medium text-lavender-900">
                    How are you feeling about this entry?
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {moods.map((mood) => (
                      <Button
                        key={mood.name}
                        variant="outline"
                        className={`flex flex-col h-auto py-3 ${
                          selectedMood === mood.name
                            ? "bg-lavender-100 border-lavender-400"
                            : "bg-white/60 hover:bg-lavender-50"
                        }`}
                        onClick={() => setSelectedMood(mood.name)}
                      >
                        <span className="text-2xl mb-1">{mood.emoji}</span>
                        <span className="text-xs">{mood.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-lavender-900">
                    Add tags to categorize your entry
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mint-600" />
                      <Input
                        placeholder="Add a tag and press Enter..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="pl-10 bg-white/60 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-400"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                      className="bg-white/60 hover:bg-lavender-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-lavender-100 text-lavender-800 hover:bg-lavender-200 px-3 py-1"
                      >
                        #{tag}
                        <button
                          className="ml-2 text-lavender-500 hover:text-lavender-700"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-xs text-mint-700 italic">
                        No tags added yet. Tags help you organize and find your
                        entries later.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-lavender-100/50 rounded-lg p-4 border border-lavender-200">
                  <h3 className="font-medium text-lavender-900 mb-2">
                    Entry Preview
                  </h3>
                  <h4 className="text-sm font-medium text-lavender-800">
                    {title || "Untitled Entry"}
                  </h4>
                  <p className="text-xs text-mint-800 mt-1 line-clamp-2">
                    {content.substring(0, 150)}
                    {content.length > 150 ? "..." : ""}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-lavender-200 bg-white/50 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            className="bg-white/60 border-lavender-200 hover:bg-lavender-50 hover:text-lavender-700"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            onClick={nextStep}
            disabled={!isFormValid()}
            className="bg-lavender-600 hover:bg-lavender-700 disabled:bg-lavender-300"
          >
            {step === 2 ? "Save Entry" : "Next: Add Details"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

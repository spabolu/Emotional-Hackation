"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notes, setNotes] = useState("");

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

  const activities = [
    "Exercise",
    "Meditation",
    "Reading",
    "Work",
    "Social",
    "Nature",
    "Rest",
    "Creative",
  ];

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-fuchsia-900 mb-2">
          Select your mood
        </h3>
        <p className="text-emerald-700">How are you feeling right now?</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => (
          <Button
            key={mood.name}
            variant={selectedMood === mood.name ? "default" : "outline"}
            className={`flex flex-col h-auto py-3 transition-all ${
              selectedMood === mood.name
                ? "bg-fuchsia-200 border-fuchsia-600 text-fuchsia-700 ring-2 ring-fuchsia-600 shadow-md"
                : "bg-white hover:bg-fuchsia-50 hover:border-fuchsia-300 hover:text-fuchsia-600"
            }`}
            onClick={() => setSelectedMood(mood.name)}
          >
            <span
              className={`text-2xl mb-1 ${
                selectedMood === mood.name
                  ? "transform scale-110 transition-transform"
                  : ""
              }`}
            >
              {mood.emoji}
            </span>
            <span
              className={`text-xs ${
                selectedMood === mood.name ? "font-bold" : "font-medium"
              }`}
            >
              {mood.name}
            </span>
          </Button>
        ))}
      </div>

      <Card className="p-4 bg-white/60 border-fuchsia-200">
        <h3 className="text-md font-medium text-fuchsia-900 mb-2">
          What's contributing to your mood?
        </h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts and feelings..."
            className="resize-none bg-white/80 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-emerald-800">
              Activities today (optional)
            </h4>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <Button
                  key={activity}
                  variant="outline"
                  size="sm"
                  className={`transition-all ${
                    selectedActivities.includes(activity)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-sm"
                      : "bg-white/60 text-emerald-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 hover:border-fuchsia-300"
                  }`}
                  onClick={() => toggleActivity(activity)}
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Button
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 py-6 text-white"
        disabled={!selectedMood}
      >
        Submit Check-in
      </Button>
    </div>
  );
}

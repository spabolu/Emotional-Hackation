"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { format, isToday, parseISO } from "date-fns";

export default function MoodCheckIn({ selectedDate, onDateChange }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notes, setNotes] = useState("");
  const [dateEntry, setDateEntry] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);

  const currentDate = selectedDate || format(new Date(), "yyyy-MM-dd");
  const isCurrentDateToday = isToday(parseISO(currentDate));

  useEffect(() => {
    // Check if there's already an entry for the selected date
    const moodData = JSON.parse(localStorage.getItem("moodData") || "{}");
    if (moodData[currentDate]) {
      setDateEntry(moodData[currentDate]);
      setSelectedMood(moodData[currentDate].mood);
      setSelectedActivities(moodData[currentDate].activities || []);
      setNotes(moodData[currentDate].notes || "");
    } else {
      // Reset form if no entry for selected date
      setDateEntry(null);
      setSelectedMood(null);
      setSelectedActivities([]);
      setNotes("");
    }

    if (dataUpdated) {
      setDataUpdated(false);
    }
  }, [currentDate, dataUpdated]);

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
    "Creative",
  ];

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;

    // Get existing mood data or create new object
    const moodData = JSON.parse(localStorage.getItem("moodData") || "{}");

    // Save the entry for the current date
    moodData[currentDate] = {
      date: currentDate,
      mood: selectedMood,
      activities: selectedActivities,
      notes: notes,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("moodData", JSON.stringify(moodData));
    setDateEntry(moodData[currentDate]);
    setDataUpdated(true);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("moodDataUpdated"));

    // Optional: Add visual feedback for user
    alert(
      `Your mood for ${format(
        parseISO(currentDate),
        "MMMM d, yyyy"
      )} has been saved!`
    );

    // If we were editing a past date, go back to today
    if (!isCurrentDateToday && onDateChange) {
      onDateChange(format(new Date(), "yyyy-MM-dd"));
    }
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all mood data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("moodData");
      setDataUpdated(true);
      alert(
        "All mood data has been cleared. Sample data will be regenerated on the next page refresh."
      );
    }
  };

  // Reset to today
  const goToToday = () => {
    if (onDateChange) {
      onDateChange(format(new Date(), "yyyy-MM-dd"));
    }
  };

  const formattedDate = format(parseISO(currentDate), "MMMM d, yyyy");

  return (
    <div className="space-y-6">
      {!isCurrentDateToday && (
        <div className="text-center mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-fuchsia-800">
            You are setting your mood for: <strong>{formattedDate}</strong>
          </p>
          <button
            onClick={goToToday}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            Return to today
          </button>
        </div>
      )}

      {dateEntry && (
        <div className="text-center mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-green-700">
            {isCurrentDateToday
              ? "You've already checked in today!"
              : `You already have a mood entry for ${formattedDate}`}
          </p>
          <p className="text-emerald-600 text-sm mt-1">
            You can update your entry if you'd like
          </p>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-fuchsia-900 mb-2">
          {isCurrentDateToday
            ? "Select your mood"
            : `Select mood for ${formattedDate}`}
        </h3>
        <p className="text-emerald-700">
          {isCurrentDateToday
            ? "How are you feeling right now?"
            : "How were you feeling on this day?"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              Activities {isCurrentDateToday ? "today" : "on this day"}{" "}
              (optional)
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
        onClick={handleSubmit}
      >
        {dateEntry ? "Update Entry" : "Save Entry"}
      </Button>

      <div className="pt-2 text-center">
        <button
          onClick={clearAllData}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Reset all mood data
        </button>
      </div>
    </div>
  );
}

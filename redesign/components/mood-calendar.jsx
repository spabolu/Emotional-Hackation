"use client";

import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay,
  subDays,
  isToday,
} from "date-fns";

export default function MoodCalendar({ onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [moodData, setMoodData] = useState({});

  // Define all possible moods
  const allMoods = [
    "Happy",
    "Sad",
    "Neutral",
    "Excited",
    "Anxious",
    "Relaxed",
    "Tired",
    "Grateful",
  ];

  // Add an effect to refresh data when localStorage changes
  useEffect(() => {
    const loadMoodData = () => {
      let storedMoodData = JSON.parse(localStorage.getItem("moodData") || "{}");

      if (Object.keys(storedMoodData).length === 0) {
        storedMoodData = generateSampleMoodData();
        localStorage.setItem("moodData", JSON.stringify(storedMoodData));
      }

      setMoodData(storedMoodData);
    };

    loadMoodData();

    // Listen for storage events to update when another component changes the data
    window.addEventListener("storage", loadMoodData);

    // Custom event listener for local updates
    const handleMoodUpdate = () => loadMoodData();
    window.addEventListener("moodDataUpdated", handleMoodUpdate);

    return () => {
      window.removeEventListener("storage", loadMoodData);
      window.removeEventListener("moodDataUpdated", handleMoodUpdate);
    };
  }, []);

  // Generate sample mood data for the past 30 days
  const generateSampleMoodData = () => {
    const sampleData = {};
    const moods = [
      "Happy",
      "Sad",
      "Neutral",
      "Excited",
      "Anxious",
      "Relaxed",
      "Tired",
      "Grateful",
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
    const today = new Date();

    // Generate entries for the past 30 days (not all days will have entries)
    for (let i = 1; i <= 30; i++) {
      // Skip some days randomly to make it look realistic
      if (Math.random() > 0.7) continue;

      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");

      // Random mood
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      // Random activities (0-3)
      const randomActivities = [];
      const activityCount = Math.floor(Math.random() * 4);
      for (let j = 0; j < activityCount; j++) {
        const randomActivity =
          activities[Math.floor(Math.random() * activities.length)];
        if (!randomActivities.includes(randomActivity)) {
          randomActivities.push(randomActivity);
        }
      }

      // Random notes
      const notes =
        Math.random() > 0.5 ? `Sample entry for ${format(date, "MMM d")}.` : "";

      sampleData[dateStr] = {
        date: dateStr,
        mood: randomMood,
        activities: randomActivities,
        notes: notes,
        timestamp: new Date(date).toISOString(),
      };
    }

    return sampleData;
  };

  // Previous month handler
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Next month handler
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Create calendar days for current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  let startDay = getDay(monthStart);
  // Adjust for Monday as first day of week
  startDay = startDay === 0 ? 6 : startDay - 1;

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getMoodColor = (mood) => {
    switch (mood) {
      case "Happy":
        return "bg-yellow-200 border-yellow-400";
      case "Sad":
        return "bg-blue-200 border-blue-400";
      case "Neutral":
        return "bg-gray-200 border-gray-400";
      case "Excited":
        return "bg-pink-200 border-pink-400";
      case "Anxious":
        return "bg-purple-200 border-purple-400";
      case "Relaxed":
        return "bg-green-200 border-green-400";
      case "Tired":
        return "bg-orange-200 border-orange-400";
      case "Grateful":
        return "bg-teal-200 border-teal-400";
      default:
        return "bg-white border-fuchsia-200";
    }
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    onDateSelect && onDateSelect(dateStr);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={prevMonth}
          className="text-emerald-700 hover:text-fuchsia-700"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="text-center text-emerald-800 font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={nextMonth}
          className="text-emerald-700 hover:text-fuchsia-700"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-emerald-700"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the start of month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {/* Actual days of the month */}
        {daysInMonth.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const entry = moodData[dateStr];
          const mood = entry?.mood;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateStr}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center rounded-md border 
              ${mood ? getMoodColor(mood) : "bg-white/60 border-fuchsia-200"}
              ${isCurrentDay ? "ring-2 ring-fuchsia-500" : ""} 
              text-xs font-medium ${
                mood ? "text-gray-800" : "text-emerald-800"
              } 
              hover:border-fuchsia-400 transition-colors cursor-pointer`}
              title={
                mood
                  ? `Mood: ${mood}${entry.notes ? ` - ${entry.notes}` : ""}`
                  : "Click to set mood"
              }
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1">
        {allMoods.map((mood) => (
          <div key={mood} className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${getMoodColor(mood)}`}
            ></div>
            <span className="text-xs text-emerald-800 capitalize">
              {mood}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
